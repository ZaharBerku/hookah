import { GET_ACCESSORY_BY_PRODUCT_OD_ID_QUERY } from "@/query/accessory";
import { GET_FILTER_QUERY } from "@/query/filter";
import { GET_HOOKAHS_BY_PRODUCT_OD_ID_QUERY } from "@/query/hookah";
import { CREATE_ORDER_MUTATION } from "@/query/order";
import { CHECK_PROMOCODE } from "@/query/promocode";
import {
  GET_ALL_PRODUCTS_BY_NAME_QUERY,
  GET_DISCOUNT_PRODUCTS_QUERY,
  GET_NEW_PRODUCTS_QUERY,
  GET_PRODUCTS_BY_COMPOSITE_ID_QUERY,
  GET_PRODUCTS_QUERY,
  GET_TOP_PRODUCTS_QUERY,
  SEARCH_PRODUCTS_QUERY,
  UPDATE_LIKES_MUTATION
} from "@/query/schema";
import { DocumentNode, parse, print, visit } from "graphql";

type Variables = Record<string, unknown>;

const isPlainObject = (value: unknown): value is Variables =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasOnlyKeys = (value: unknown, keys: string[]) =>
  isPlainObject(value) && Object.keys(value).every((key) => keys.includes(key));

const isIntegerLike = (value: unknown) =>
  Number.isInteger(typeof value === "string" ? Number(value) : value);

const validateLikes = (variables: Variables) =>
  hasOnlyKeys(variables, ["odId", "data"]) &&
  isIntegerLike(variables.odId) &&
  hasOnlyKeys(variables.data, ["likes"]) &&
  Number.isInteger((variables.data as Variables).likes);

const MAX_ORDER_ITEMS = 100;

const isValidOrderItem = (item: unknown) =>
  hasOnlyKeys(item, [
    "id",
    "odId",
    "name",
    "price",
    "discount",
    "quantity",
    "numberOf"
  ]) &&
  isIntegerLike((item as Variables).odId) &&
  Number.isInteger((item as Variables).quantity) &&
  ((item as Variables).quantity as number) > 0;

const validateOrder = (variables: Variables) => {
  if (
    !hasOnlyKeys(variables, ["data"]) ||
    !hasOnlyKeys(variables.data, [
      "name",
      "phoneNumber",
      "address",
      "department",
      "order",
      "publishedAt"
    ])
  ) {
    return false;
  }
  const { order } = variables.data as Variables;
  return (
    Array.isArray(order) &&
    order.length > 0 &&
    order.length <= MAX_ORDER_ITEMS &&
    order.every(isValidOrderItem)
  );
};

const ALLOWED_OPERATIONS: {
  document: DocumentNode;
  validate?: (variables: Variables) => boolean;
}[] = [
  { document: GET_PRODUCTS_QUERY },
  { document: GET_TOP_PRODUCTS_QUERY },
  { document: GET_NEW_PRODUCTS_QUERY },
  { document: GET_DISCOUNT_PRODUCTS_QUERY },
  { document: GET_FILTER_QUERY },
  { document: SEARCH_PRODUCTS_QUERY },
  { document: GET_ALL_PRODUCTS_BY_NAME_QUERY },
  { document: GET_PRODUCTS_BY_COMPOSITE_ID_QUERY },
  { document: GET_ACCESSORY_BY_PRODUCT_OD_ID_QUERY },
  { document: GET_HOOKAHS_BY_PRODUCT_OD_ID_QUERY },
  { document: CHECK_PROMOCODE },
  { document: CREATE_ORDER_MUTATION, validate: validateOrder },
  { document: UPDATE_LIKES_MUTATION, validate: validateLikes }
];

const normalize = (document: DocumentNode) =>
  print(
    visit(document, {
      Field: (node) => (node.name.value === "__typename" ? null : undefined)
    })
  );

const allowlist = new Map(
  ALLOWED_OPERATIONS.map((operation) => [
    normalize(operation.document),
    operation
  ])
);

export const isAllowedGraphqlRequest = (
  query: unknown,
  variables: unknown = {}
) => {
  if (typeof query !== "string" || !isPlainObject(variables ?? {})) {
    return false;
  }
  let document: DocumentNode;
  try {
    document = parse(query);
  } catch {
    return false;
  }
  const operation = allowlist.get(normalize(document));
  if (!operation) return false;
  return operation.validate
    ? operation.validate((variables ?? {}) as Variables)
    : true;
};
