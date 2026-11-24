import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

import { withTimeout } from "@/lib/withTimeout";
import { env } from "@/utils/config";

export const NOTIFY_TIMEOUT_MS = 2000;

const client = new TelegramClient(
  new StringSession(env.SESSION_TOKEN),
  +(env.API_ID as string),
  env.API_HASH as string,
  {
    connectionRetries: 5
  }
);

const deliver = async (message: string) => {
  if (!env.CHANNEL_ID) return;
  const dialogId = BigInt(env.CHANNEL_ID.replace("n", "")) as any;
  if (!client.connected) {
    await client.connect();
  }
  await client.sendMessage(dialogId, { message, parseMode: "md2" });
};

export const sendTelegramMessage = (message: string) =>
  withTimeout(
    deliver(message),
    NOTIFY_TIMEOUT_MS,
    "Telegram request timed out"
  );
