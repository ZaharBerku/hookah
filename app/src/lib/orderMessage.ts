import { calculeteAmountWithDiscount } from "@/utils/helpers/calculeteAmountWithDiscount";

export type StoredOrderItem = {
  name: string;
  price: number;
  discount: number;
  quantity: number;
};

export type OrderMessageInput = {
  orderId?: string;
  firstName: string;
  lastName: string;
  city: string;
  phone: string;
  warehouse: string;
  items: StoredOrderItem[];
  promocode?: string | null;
  promocodeDiscount?: number | null;
};

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

export const escapeMessageText = (value: string | number) =>
  String(value).replace(
    /[&<>*_~`|\-[\]()!]/g,
    (char) => `&#${char.charCodeAt(0)};`
  );

export const calculateOrderAmounts = (items: StoredOrderItem[]) =>
  items.reduce(
    (total, { price, discount, quantity }) => ({
      amount: total.amount + Math.floor(price * quantity),
      amountWithDiscount:
        total.amountWithDiscount +
        Math.floor(calculeteAmountWithDiscount(price, discount) * quantity)
    }),
    { amount: 0, amountWithDiscount: 0 }
  );

export const TELEGRAM_MESSAGE_LIMIT = 4096;

export const buildOrderMessages = (input: OrderMessageInput) => {
  const { amount, amountWithDiscount } = calculateOrderAmounts(input.items);
  const blocks = input.items.map((product, index) => {
    const nubmerProduct = generateNumberEmoji(index + 1);
    return `----------------------
            ${nubmerProduct} *Назва:* ${escapeMessageText(product.name)}
                 *Кількість:* ${product.quantity}
                 *Ціна:*  ${product.price}грн
                 *Знижка:* ${product.discount}%
                ----------------------`;
  });

  const orderNumber = (partMark: string) => {
    const parts = [
      input.orderId ? `№ ${escapeMessageText(input.orderId)}` : "",
      partMark
    ].filter(Boolean);
    return parts.length ? `    ${parts.join(" ")}\n` : "";
  };
  const partMark = (part: number, total: number) =>
    total > 1 ? escapeMessageText(`(${part}/${total})`) : "";

  const head = (part: number, total: number) => `
${orderNumber(partMark(part, total))}    🔔 *Нове замовлення*

    👤 *Ім'я:* ${escapeMessageText(input.lastName)} ${escapeMessageText(input.firstName)}
    🏙️ *Місто:* ${escapeMessageText(input.city)}
    📞 *Телефон:* ${escapeMessageText(input.phone)}
    🏢 *Відділення:* ${escapeMessageText(input.warehouse)}
    ----------------------
    🛒 *Замовлення:*
        `;
  const continuation = (part: number, total: number) => `
${orderNumber(partMark(part, total))}    🛒 *Замовлення:*
        `;
  const summary = `      ----------------------
      *Промокод:* ${input.promocode ? escapeMessageText(input.promocode) : "Відсутній"}
      *Знижка промокода:* ${input.promocodeDiscount || 0}%
      💵 *Загальна сума:* ${amount} грн
      💵 *Загальна сума зі знижкою:* ${amountWithDiscount} грн
    `;
  const tail = `\n${summary}`;

  const whole = `${head(1, 1)}${blocks.join(" ")}${tail}`;
  if (whole.length <= TELEGRAM_MESSAGE_LIMIT) return [whole];

  const lead = (index: number, part: number, total: number) =>
    index === 0 ? head(part, total) : continuation(part, total);
  const groups: string[][] = [[]];
  for (const block of blocks) {
    const group = groups[groups.length - 1];
    const size =
      lead(groups.length - 1, 99, 99).length +
      [...group, block].join(" ").length;
    if (group.length && size > TELEGRAM_MESSAGE_LIMIT) groups.push([block]);
    else group.push(block);
  }
  const lastIndex = groups.length - 1;
  const summaryAlone =
    lead(lastIndex, 99, 99).length +
      groups[lastIndex].join(" ").length +
      tail.length >
    TELEGRAM_MESSAGE_LIMIT;
  const total = groups.length + (summaryAlone ? 1 : 0);

  const messages = groups.map((group, index) => {
    const isLast = index === lastIndex && !summaryAlone;
    return `${lead(index, index + 1, total)}${group.join(" ")}${isLast ? tail : ""}`;
  });
  if (summaryAlone) {
    messages.push(`\n${orderNumber(partMark(total, total))}${summary}`);
  }
  return messages;
};
