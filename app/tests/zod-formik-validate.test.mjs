import assert from "node:assert/strict";
import { test } from "node:test";
import * as z from "zod";

import { zodFormikValidate } from "../src/utils/helpers/zodFormikValidate.ts";

const schema = z.object({
  name: z.string({ error: "required" }).trim().min(1, "required"),
  phone: z
    .string({ error: "required" })
    .regex(/^\+380\d{9}$/, "bad phone")
    .min(5, "too short")
});

test("returns no errors for valid values", () => {
  assert.deepEqual(
    zodFormikValidate(schema)({ name: "Taras", phone: "+380000000000" }),
    {}
  );
});

test("maps missing fields to their messages", () => {
  assert.deepEqual(zodFormikValidate(schema)({}), {
    name: "required",
    phone: "required"
  });
});

test("keeps only the first message per field", () => {
  assert.deepEqual(zodFormikValidate(schema)({ name: "x", phone: "1" }), {
    phone: "bad phone"
  });
});

test("treats empty strings as missing, like Formik validationSchema", () => {
  assert.deepEqual(zodFormikValidate(schema)({ name: "", phone: "" }), {
    name: "required",
    phone: "required"
  });
});
