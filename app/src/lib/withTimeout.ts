export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string
) =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    promise.then(resolve, reject).finally(() => clearTimeout(timer));
  });
