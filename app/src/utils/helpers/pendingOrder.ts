import { createIdempotencyKey } from "./createIdempotencyKey";

const STORAGE_KEY = "pendingOrderKey";
const MAX_AGE_MS = 30 * 60 * 1000;

const withStorage = <T>(action: () => T, fallback: T): T => {
  try {
    return action();
  } catch {
    return fallback;
  }
};

export const readPendingOrderKey = (now = Date.now()): string | null =>
  withStorage<string | null>(() => {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { key, savedAt } = JSON.parse(raw);
    if (
      typeof key === "string" &&
      typeof savedAt === "number" &&
      now - savedAt < MAX_AGE_MS
    ) {
      return key;
    }
    window.sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }, null);

export const savePendingOrderKey = (key: string, now = Date.now()) =>
  withStorage(
    () =>
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ key, savedAt: now })
      ),
    undefined
  );

export const clearPendingOrderKey = () =>
  withStorage(() => window.sessionStorage.removeItem(STORAGE_KEY), undefined);

export const prepareOrderAttempt = async ({
  current,
  checkStock,
  createKey = createIdempotencyKey
}: {
  current: string | null;
  checkStock: () => Promise<boolean>;
  createKey?: () => string;
}): Promise<string | null> => {
  const pending = current ?? readPendingOrderKey();
  if (pending === null && !(await checkStock())) return null;
  const key = pending ?? createKey();
  savePendingOrderKey(key);
  return key;
};
