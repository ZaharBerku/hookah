import {
  CREATE_ORDER_MUTATION,
  GET_ORDER_BY_KEY_QUERY,
  GET_ORDER_PRODUCTS_QUERY
} from "@/query/order";
import type { DocumentNode } from "graphql";
import { createHash } from "node:crypto";
import { z } from "zod";

import { buildOrderMessage, type StoredOrderItem } from "@/lib/orderMessage";
import type { RateLimitResult } from "@/lib/rateLimit";
import type { StrapiGraphqlResponse } from "@/lib/strapi";

export const MAX_ORDER_ITEMS = 20;
export const MAX_ITEM_QUANTITY = 20;
const phoneRegex = /^(\+380)\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/;

const text = (max: number) =>
  z
    .string()
    .transform((value) => value.replace(/\s+/g, " ").trim())
    .pipe(z.string().min(1).max(max));

const OrderRequestSchema = z.object({
  name: text(100),
  lastName: text(100),
  city: text(200),
  phone: z.string().regex(phoneRegex),
  warehouses: text(300),
  locale: z.enum(["uk", "ru"]),
  idempotencyKey: z
    .string()
    .min(8)
    .max(100)
    .regex(/^[A-Za-z0-9_-]+$/),
  promocode: z.string().trim().max(100).nullish(),
  items: z
    .array(
      z.object({
        compositeId: z.string().min(1).max(200),
        quantity: z.number().int().min(1).max(MAX_ITEM_QUANTITY)
      })
    )
    .min(1)
    .max(MAX_ORDER_ITEMS)
});

export type OrderDeps = {
  graphql: (
    query: DocumentNode,
    variables: Record<string, unknown>
  ) => Promise<StrapiGraphqlResponse>;
  notify: (message: string) => Promise<void>;
  rateLimit?: () => RateLimitResult;
  now?: () => Date;
};

export type PlaceOrderResult = {
  status: number;
  body: Record<string, unknown>;
  headers?: Record<string, string>;
};

type UnavailableItem = {
  compositeId: string;
  name: string | null;
  available: number;
  missing?: boolean;
};

const fail = (
  status: number,
  error: string,
  extra: Record<string, unknown> = {}
): PlaceOrderResult => ({ status, body: { error, ...extra } });

const invalidOrder = (fields: string[] = []) =>
  fail(400, "INVALID_ORDER", { fields });

const getErrorDetails = (response: StrapiGraphqlResponse): any =>
  response.errors?.[0]?.extensions?.error?.details;

const parseStoredItems = (order: unknown): StoredOrderItem[] => {
  const parsed = typeof order === "string" ? JSON.parse(order) : order;
  return (Array.isArray(parsed) ? parsed : []).map((item: any) => ({
    name: String(item.name),
    price: Number(item.price),
    discount: Number(item.discount) || 0,
    quantity: Number(item.quantity)
  }));
};

export const placeOrder = async (
  input: unknown,
  deps: OrderDeps
): Promise<PlaceOrderResult> => {
  const parsed = OrderRequestSchema.safeParse(input);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => String(issue.path[0]));
    return invalidOrder(Array.from(new Set(fields)));
  }
  const request = parsed.data;

  const quantities = new Map<string, number>();
  for (const { compositeId, quantity } of request.items) {
    quantities.set(compositeId, (quantities.get(compositeId) || 0) + quantity);
  }
  if (Array.from(quantities.values()).some((q) => q > MAX_ITEM_QUANTITY)) {
    return invalidOrder(["items"]);
  }

  const requestHash = createHash("sha256")
    .update(
      JSON.stringify(
        Array.from(quantities.entries()).sort(([a], [b]) => (a < b ? -1 : 1))
      )
    )
    .digest("hex");

  const notifyOrder = async (stored: any, orderId: unknown) => {
    try {
      await deps.notify(
        buildOrderMessage({
          orderId: String(orderId),
          firstName: request.name,
          lastName: request.lastName,
          city: stored.address,
          phone: stored.phoneNumber,
          warehouse: stored.department,
          items: parseStoredItems(stored.order),
          promocode: stored.promocode,
          promocodeDiscount: stored.promocodeDiscount
        })
      );
      return true;
    } catch (error) {
      console.error(
        `Order ${orderId} was recorded but the notification failed`,
        error
      );
      return false;
    }
  };

  const findExistingOrder = async () => {
    try {
      const response = await deps.graphql(GET_ORDER_BY_KEY_QUERY, {
        key: request.idempotencyKey
      });
      if (response.errors?.length) {
        console.error(
          "Order lookup by idempotency key failed",
          response.errors
        );
      }
      return response.data?.orders?.data?.[0] ?? null;
    } catch (error) {
      console.error("Order lookup by idempotency key failed", error);
      return null;
    }
  };

  const replayExistingOrder = async (
    existing: any
  ): Promise<PlaceOrderResult> => {
    const { requestHash: storedHash, stockReserved } = existing.attributes;
    if (storedHash && storedHash !== requestHash) {
      return fail(409, "IDEMPOTENCY_CONFLICT");
    }
    if (stockReserved !== true) return fail(409, "ORDER_IN_PROGRESS");
    return {
      status: 200,
      body: {
        ok: true,
        notified: await notifyOrder(existing.attributes, existing.id)
      }
    };
  };

  const createNewOrder = async (
    release: () => void
  ): Promise<PlaceOrderResult> => {
    const fetchProducts = async (locale: string, compositeIds: string[]) => {
      const response = await deps.graphql(GET_ORDER_PRODUCTS_QUERY, {
        locale,
        compositeIds
      });
      if (response.errors?.length || !response.data?.products?.data) {
        throw new Error("Product lookup failed");
      }
      return response.data.products.data as any[];
    };

    let products: any[];
    try {
      const compositeIds = Array.from(quantities.keys());
      products = await fetchProducts(request.locale, compositeIds);
      const found = new Set(products.map((p) => p.attributes.compositeId));
      const absent = compositeIds.filter((id) => !found.has(id));
      if (absent.length) {
        const otherLocale = request.locale === "uk" ? "ru" : "uk";
        products = products.concat(await fetchProducts(otherLocale, absent));
      }
    } catch {
      return fail(502, "UPSTREAM_ERROR");
    }

    const byCompositeId = new Map(
      products.map((product) => [product.attributes.compositeId, product])
    );
    const missing: UnavailableItem[] = Array.from(quantities.keys())
      .filter((compositeId) => !byCompositeId.has(compositeId))
      .map((compositeId) => ({
        compositeId,
        name: null,
        available: 0,
        missing: true
      }));
    if (missing.length) {
      return fail(409, "OUT_OF_STOCK", { items: missing });
    }

    const order = Array.from(quantities.entries()).map(
      ([compositeId, quantity]) => {
        const { id, attributes } = byCompositeId.get(compositeId);
        return { id, compositeId, odId: attributes.odId ?? null, quantity };
      }
    );

    let created: any;
    try {
      const response = await deps.graphql(CREATE_ORDER_MUTATION, {
        data: {
          name: request.name,
          phoneNumber: request.phone,
          address: request.city,
          department: request.warehouses,
          order,
          promocode: request.promocode || null,
          idempotencyKey: request.idempotencyKey,
          requestHash,
          publishedAt: (deps.now?.() ?? new Date()).toISOString()
        }
      });
      const details = getErrorDetails(response);
      if (details?.code === "OUT_OF_STOCK") {
        const items: UnavailableItem[] = (details.items || []).map(
          (item: any) => ({
            compositeId: item.compositeId,
            name:
              byCompositeId.get(item.compositeId)?.attributes.name ??
              item.name ??
              null,
            available: Number(item.available) || 0
          })
        );
        return fail(409, "OUT_OF_STOCK", { items });
      }
      if (details?.code === "PROMOCODE_INVALID") {
        return fail(422, "PROMOCODE_INVALID");
      }
      if (details?.code === "INVALID_ORDER") {
        return invalidOrder(["items"]);
      }
      created = response.data?.createOrder?.data;
      if (response.errors?.length || !created) {
        const concurrent = await findExistingOrder();
        if (!concurrent) return fail(502, "UPSTREAM_ERROR");
        release();
        return replayExistingOrder(concurrent);
      }
    } catch {
      return fail(502, "UPSTREAM_ERROR");
    }

    const notified = await notifyOrder(created.attributes, created.id);
    return { status: 200, body: { ok: true, notified } };
  };

  const existing = await findExistingOrder();
  if (existing) return replayExistingOrder(existing);

  const slot = deps.rateLimit?.();
  if (slot && !slot.allowed) {
    return {
      ...fail(429, "RATE_LIMITED"),
      headers: { "Retry-After": String(slot.retryAfterSeconds) }
    };
  }
  const release = () => slot?.release();
  const result = await createNewOrder(release);
  if (result.status !== 200) release();
  return result;
};
