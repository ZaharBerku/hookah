import { calculeteAmountWithDiscount } from "@/utils/helpers/calculeteAmountWithDiscount";

export type StoredOrderItem = {
  name: string;
  price: number;
  discount: number;
  quantity: number;
};

export type OrderMessageInput = {
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

export const buildOrderMessage = (input: OrderMessageInput) => {
  const { amount, amountWithDiscount } = calculateOrderAmounts(input.items);
  const order = input.items
    .map((product, index) => {
      const nubmerProduct = generateNumberEmoji(index + 1);
      return `----------------------
            ${nubmerProduct} *Назва:* ${escapeMessageText(product.name)}
                 *Кількість:* ${product.quantity}
                 *Ціна:*  ${product.price}грн
                 *Знижка:* ${product.discount}%
                ----------------------`;
    })
    .join(" ");

  return `
    🔔 *Нове замовлення*

    👤 *Ім'я:* ${escapeMessageText(input.lastName)} ${escapeMessageText(input.firstName)}
    🏙️ *Місто:* ${escapeMessageText(input.city)}
    📞 *Телефон:* ${escapeMessageText(input.phone)}
    🏢 *Відділення:* ${escapeMessageText(input.warehouse)}
    ----------------------
    🛒 *Замовлення:*
        ${order}
      ----------------------
      *Промокод:* ${input.promocode ? escapeMessageText(input.promocode) : "Відсутній"}
      *Знижка промокода:* ${input.promocodeDiscount || 0}%
      💵 *Загальна сума:* ${amount} грн
      💵 *Загальна сума зі знижкою:* ${amountWithDiscount} грн
    `;
};
