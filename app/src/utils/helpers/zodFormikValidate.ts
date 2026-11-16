import type { FormikErrors } from "formik";
import type { ZodType } from "zod";

const emptyStringsToUndefined = (values: unknown): unknown => {
  if (values === "") return undefined;
  if (Array.isArray(values)) return values.map(emptyStringsToUndefined);
  if (values && typeof values === "object") {
    return Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        emptyStringsToUndefined(value)
      ])
    );
  }
  return values;
};

export const zodFormikValidate =
  <T>(schema: ZodType<T>) =>
  (values: unknown): FormikErrors<T> => {
    const result = schema.safeParse(emptyStringsToUndefined(values));
    if (result.success) return {};
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (!(path in errors)) errors[path] = issue.message;
    }
    return errors as FormikErrors<T>;
  };
