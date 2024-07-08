import { OrderAttributes } from "./fragments";

export type CreateOrderResponse = {
  createOrder: {
    data: {
      attributes: OrderAttributes;
    };
  };
};
