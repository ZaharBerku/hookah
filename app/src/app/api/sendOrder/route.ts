import { NextRequest, NextResponse } from "next/server";

import { placeOrder } from "@/lib/placeOrder";
import { createRateLimiter } from "@/lib/rateLimit";
import { strapiGraphql } from "@/lib/strapi";
import { sendTelegramMessage } from "@/lib/telegram";
import { getClientIp } from "@/utils/helpers/getClientIp";

const MAX_BODY_BYTES = 20_000;
const STRAPI_BUDGET_MS = 5500;
const STRAPI_CALL_TIMEOUT_MS = 3000;
const orderRateLimiter = createRateLimiter({
  limit: 5,
  windowMs: 10 * 60 * 1000
});

export async function POST(request: NextRequest) {
  const declaredLength = Number(request.headers.get("content-length"));
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "PAYLOAD_TOO_LARGE" }, { status: 413 });
  }
  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "PAYLOAD_TOO_LARGE" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "INVALID_ORDER", fields: [] },
      { status: 400 }
    );
  }

  const strapiDeadline = Date.now() + STRAPI_BUDGET_MS;
  const {
    status,
    body: result,
    headers
  } = await placeOrder(body, {
    graphql: (query, variables) =>
      strapiGraphql(
        query,
        variables,
        Math.min(
          STRAPI_CALL_TIMEOUT_MS,
          Math.max(strapiDeadline - Date.now(), 1)
        )
      ),
    notify: sendTelegramMessage,
    rateLimit: () => orderRateLimiter.check(getClientIp())
  });
  return NextResponse.json(result, { status, headers });
}
