const DEFINITIVE_STATUSES = [400, 409, 422];

export const shouldKeepIdempotencyKey = (status: number, error?: string) => {
  if (status >= 200 && status < 300) return false;
  if (error === "ORDER_IN_PROGRESS") return true;
  return !DEFINITIVE_STATUSES.includes(status);
};
