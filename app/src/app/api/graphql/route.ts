import { NextRequest, NextResponse } from "next/server";

import { isAllowedGraphqlRequest } from "@/lib/graphqlAllowlist";

const MAX_BODY_BYTES = 100_000;

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: { query?: unknown; variables?: unknown; operationName?: unknown };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !isAllowedGraphqlRequest(body.query, body.variables)
  ) {
    return NextResponse.json(
      { error: "Operation not allowed" },
      { status: 403 }
    );
  }

  const strapiUrl = process.env.STRAPI_URL || "http://127.0.0.1:1337";
  const token = process.env.API_TOKEN;

  try {
    const response = await fetch(`${strapiUrl}/graphql`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        query: body.query,
        variables: body.variables,
        operationName: body.operationName
      })
    });

    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return NextResponse.json(
      { error: "Upstream unavailable" },
      { status: 502 }
    );
  }
}
