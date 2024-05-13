import { NextResponse, NextRequest } from "next/server";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

import { env } from "@/utils/config";

const stringSession = new StringSession(env.SESSION_TOKEN);

const client = new TelegramClient(
  stringSession,
  +(env.API_ID as string),
  env.API_HASH as string,
  {
    connectionRetries: 5
  }
);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const message = Object.entries(data)
      .map(([name, value]) => {
        if (name === "products") {
          return `*Замолення*: ${(value as any)
            .map(
              (product: any) =>
              `----------------------
              Назва: ${product.name}
              Кількість: ${product.quantity}
              Ціна: ${product.price}грн
              Знижка: ${product.discount}%
              ----------------------`
            )
            .join(" ")}`;
        }
        return `*${name}*: ${value}` + "\n";
      })
      .join(" ");

    if (client.connected) {
      await client.sendMessage(env.CHANNEL_ID as string, {
        message,
        parseMode: "md2"
      });
    } else {
      await client.connect();
      await client.sendMessage(env.CHANNEL_ID as string, {
        message,
        parseMode: "md2"
      });
    }

    return NextResponse.json(null);
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
