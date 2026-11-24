import { CREATE_ORDER_MUTATION, GET_ORDER_PRODUCTS_QUERY } from "@/query/order";
import type { DocumentNode } from "graphql";
import { z } from "zod";

import { buildOrderMessage, type StoredOrderItem } from "@/lib/orderMessage";
import type { StrapiGraphqlResponse } from "@/lib/strapi";

const MAX_ORDER_ITEMS = 100;
const MAX_ITEM_QUANTITY = 1000;
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
  now?: () => Date;
};

export type PlaceOrderResult = {
  status: number;
  body: Record<string, unknown>;
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
  if (!parsed.success) return fail(400, "INVALID_ORDER");
  const request = parsed.data;

  const quantities = new Map<string, number>();
  for (const { compositeId, quantity } of request.items) {
    quantities.set(compositeId, (quantities.get(compositeId) || 0) + quantity);
  }

  let products: any[];
  try {
    const response = await deps.graphql(GET_ORDER_PRODUCTS_QUERY, {
      locale: request.locale,
      compositeIds: Array.from(quantities.keys())
    });
    if (response.errors?.length || !response.data?.products?.data) {
      return fail(502, "UPSTREAM_ERROR");
    }
    products = response.data.products.data;
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
      return { id, odId: attributes.odId, quantity };
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
        publishedAt: (deps.now?.() ?? new Date()).toISOString()
      }
    });
    const details = getErrorDetails(response);
    if (details?.code === "OUT_OF_STOCK") {
      const byOdId = new Map(
        products.map((product) => [Number(product.attributes.odId), product])
      );
      const items: UnavailableItem[] = (details.items || []).map(
        (item: any) => {
          const product = byOdId.get(Number(item.odId));
          return {
            compositeId: product?.attributes.compositeId,
            name: product?.attributes.name ?? item.name ?? null,
            available: Number(item.available) || 0
          };
        }
      );
      return fail(409, "OUT_OF_STOCK", { items });
    }
    if (details?.code === "PROMOCODE_INVALID") {
      return fail(422, "PROMOCODE_INVALID");
    }
    if (details?.code === "INVALID_ORDER") {
      return fail(400, "INVALID_ORDER");
    }
    created = response.data?.createOrder?.data?.attributes;
    if (response.errors?.length || !created) {
      return fail(502, "UPSTREAM_ERROR");
    }
  } catch {
    return fail(502, "UPSTREAM_ERROR");
  }

  let notified = true;
  try {
    await deps.notify(
      buildOrderMessage({
        firstName: request.name,
        lastName: request.lastName,
        city: created.address,
        phone: created.phoneNumber,
        warehouse: created.department,
        items: parseStoredItems(created.order),
        promocode: created.promocode,
        promocodeDiscount: created.promocodeDiscount
      })
    );
  } catch (error) {
    notified = false;
    console.error("Failed to send the order notification", error);
  }

  return { status: 200, body: { ok: true, notified } };
};
