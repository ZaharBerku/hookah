import { NextRequest, NextResponse } from "next/server";

import { placeOrder } from "@/lib/placeOrder";
import { createRateLimiter } from "@/lib/rateLimit";
import { strapiGraphql } from "@/lib/strapi";
import { sendTelegramMessage } from "@/lib/telegram";
import { getClientIp } from "@/utils/helpers/getClientIp";

const MAX_BODY_BYTES = 20_000;
const orderRateLimiter = createRateLimiter({
  limit: 5,
  windowMs: 10 * 60 * 1000
});

export async function POST(request: NextRequest) {
  const limit = orderRateLimiter.check(getClientIp());
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "RATE_LIMITED" },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) }
      }
    );
  }

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

  const { status, body: result } = await placeOrder(body, {
    graphql: strapiGraphql,
    notify: sendTelegramMessage
  });
  return NextResponse.json(result, { status });
}
