"use client";

import { Button, List } from "@/compoents/atoms";
import { CartCard } from "@/compoents/organisms";
import { observer } from "mobx-react-lite";

import { useStores } from "@/hooks";
import { useRouter } from "@/utils/navigation";

const ListCartCard = observer(() => {
  const router = useRouter();
  const { cart } = useStores();

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="px-6 py-5 border-black border flex flex-col justify-center items-center border-opacity-10 rounded-3xl h-full flex-[60%]">
      {Boolean(cart.cart.length) && (
        <List className="pb-5 w-full">
          {cart.cart.map((item: any) => {
            const product = item.attributes;
            return (
              <List.Item
                key={item.id}
                className="border-b border-black border-opacity-10"
              >
                <CartCard
                  compositeId={product.compositeId}
                  image={{
                    src: product.previewImage.data.attributes.url,
                    alt: ""
                  }}
                  price={product.price}
                  discount={product.discount}
                  name={product.name}
                  quantity={cart?.selectedProducts[product.compositeId]?.quantity}
                />
              </List.Item>
            );
          })}
        </List>
      )}
      <Button
        onClick={handleBack}
        color="second"
        className="border-black border-opacity-30 px-15"
      >
        Повернутись до покупок
      </Button>
    </div>
  );
});

export default ListCartCard;
