import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

import { env } from "@/utils/config";

const client = new TelegramClient(
  new StringSession(env.SESSION_TOKEN),
  +(env.API_ID as string),
  env.API_HASH as string,
  {
    connectionRetries: 5
  }
);

export const sendTelegramMessage = async (message: string) => {
  if (!env.CHANNEL_ID) return;
  const dialogId = BigInt(env.CHANNEL_ID.replace("n", "")) as any;
  if (!client.connected) {
    await client.connect();
  }
  await client.sendMessage(dialogId, { message, parseMode: "md2" });
};
