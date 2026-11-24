export const isInStock = (numberOf?: number | string | null) =>
  Number(numberOf) > 0;

export const getAvailableQuantity = (numberOf?: number | string | null) =>
  isInStock(numberOf) ? Math.floor(Number(numberOf)) : 0;
