import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

import { env } from "@/utils/config";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("location") || "ua";

    const response = await axios({
      method: "GET",
      url: env.NOVA_API,
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        apiKey: env.NOVA_API_KEY,
        modelName: "Address",
        calledMethod: "getWarehouseTypes",
        methodProperties: {
          Language: language
        }
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
