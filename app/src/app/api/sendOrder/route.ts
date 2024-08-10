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

const generateNumberEmoji = (number: number) => {
  const numberMap: any = {
    0: "\u0030\uFE0F\u20E3",
    1: "\u0031\uFE0F\u20E3",
    2: "\u0032\uFE0F\u20E3",
    3: "\u0033\uFE0F\u20E3",
    4: "\u0034\uFE0F\u20E3",
    5: "\u0035\uFE0F\u20E3",
    6: "\u0036\uFE0F\u20E3",
    7: "\u0037\uFE0F\u20E3",
    8: "\u0038\uFE0F\u20E3",
    9: "\u0039\uFE0F\u20E3"
  };

  const digits = String(number).split("");
  return digits.map((digit) => numberMap[digit]).join("");
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const order = Object.values(data.products as any)
      .map((product: any, index: number) => {
        const nubmerProduct = generateNumberEmoji(index + 1);
        return `----------------------
            ${nubmerProduct} *Назва:* ${product.attributes.name}
                 *Кількість:* ${product.quantity}
                 *Ціна:*  ${product.attributes.price}грн
                 *Знижка:* ${product.attributes.discount}%
                ----------------------`;
      })
      .join(" ");

    const message = `
    🔔 *Нове замовлення*

    👤 *Ім'я:* ${data.lastName} ${data.name}
    🏙️ *Місто:* ${data.city}
    📞 *Телефон:* ${data.phone}
    🏢 *Відділення:* ${data.warehouses}
    ----------------------
    🛒 *Замовлення:*
        ${order}
      ----------------------
      💵 *Загальна сума:* ${data.amount} грн
      💵 *Загальна сума зі знижкою:* ${data.amountWithDiscount} грн
    `;
    if (env.CHANNEL_ID) {
      const cleanDialogIdString = env.CHANNEL_ID.replace("n", "");
      const dialogIdBigInt = BigInt(cleanDialogIdString) as any;
      if (client.connected) {
        await client.sendMessage(dialogIdBigInt, {
          message,
          parseMode: "md2"
        });
      } else {
        await client.connect();
        await client.sendMessage(dialogIdBigInt, {
          message,
          parseMode: "md2"
        });
      }
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
