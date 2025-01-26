"use client";

import { Button, List } from "@/componets/atoms";
import { CartCard } from "@/componets/organisms";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { useStores } from "@/hooks";
import { useRouter } from "@/utils/navigation";

interface ListCartCardProps {
  isHideButtonReturnToShopping?: boolean;
  classes?: {
    wrapper?: string;
    list?: string;
  };
}

const ListCartCard: FC<ListCartCardProps> = observer(
  ({ isHideButtonReturnToShopping, classes }) => {
    const router = useRouter();
    const { cart } = useStores();

    const handleBack = () => {
      router.push("/");
    };

    return (
      <div
        className={clsx(
          "px-6 py-5 border-black border flex flex-col justify-center items-center border-opacity-10 rounded-3xl h-full flex-[60%]",
          classes?.wrapper
        )}
      >
        {Boolean(cart.cart.length) && (
          <List className={clsx("w-full", classes?.list)}>
            {cart.cart.map((item: any) => {
              const product = item.attributes;
              return (
                <List.Item
                  key={item.id}
                  className="border-b last:border-none border-black border-opacity-10"
                >
                  <CartCard
                    compositeId={product.compositeId}
                    image={{
                      src: product.previewImage.data.attributes.url,
                      alt:
                        product.previewImage.data?.attributes
                          ?.alternativeText || "product"
                    }}
                    price={product.price}
                    discount={product.discount}
                    name={product.name}
                    href={
                      product?.type?.data?.attributes?.slugType
                        ? `/${product.category.data.attributes.name}/${product?.type?.data?.attributes?.slugType}/${product.brand.data.attributes.slug}/${product.compositeId}`
                        : `/${product.category.data.attributes.name}/${product.brand.data.attributes.slug}/${product.compositeId}`
                    }
                    availabilityQuantity={product.numberOf}
                    quantity={
                      cart?.selectedProducts[product.compositeId]?.quantity
                    }
                  />
                </List.Item>
              );
            })}
          </List>
        )}
        {!isHideButtonReturnToShopping && (
          <div className="pt-5 border-black border-opacity-10 border-t">
            <Button
              onClick={handleBack}
              color="second"
              className="border-black border-opacity-30 px-15 "
            >
              Повернутись до покупок
            </Button>
          </div>
        )}
      </div>
    );
  }
);

export default ListCartCard;
