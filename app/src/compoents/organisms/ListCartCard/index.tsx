"use client";

import { List } from "@/compoents/atoms";
import { CartCard } from "@/compoents/organisms";
import { observer } from "mobx-react-lite";

import { useStores } from "@/hooks";

const ListCartCard = observer(() => {
  const { cart } = useStores();

  return (
    <div className="px-6 border-black border border-opacity-10 rounded-3xl">
      <List>
        {cart.cart.map((product: any, index: number) => {
          return (
            <List.Item
              key={index}
              className="border-b border-black border-opacity-10 last:border-none"
            >
              <CartCard
                id={product.id}
                image={product.image}
                price={product.price}
                discount={product.discount}
                name={product.name}
                quantity={product.quantity}
              />
            </List.Item>
          );
        })}
      </List>
    </div>
  );
});

export default ListCartCard;
