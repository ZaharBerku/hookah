import { NextRequest, NextResponse } from "next/server";

import { placeOrder } from "@/lib/placeOrder";
import { strapiGraphql } from "@/lib/strapi";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_ORDER" }, { status: 400 });
  }

  const { status, body: result } = await placeOrder(body, {
    graphql: strapiGraphql,
    notify: sendTelegramMessage
  });
  return NextResponse.json(result, { status });
}
