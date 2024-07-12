"use client";

import { Modal, Button, Icon } from "@/compoents/atoms";
import { ListCartCardSkeleton } from "@/compoents/organisms";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { FC, useEffect } from "react";

import { useStores } from "@/hooks";

const ListCartCard = dynamic(() => import("../../../organisms/ListCartCard"), {
  ssr: false,
  loading: () => <ListCartCardSkeleton />
});

export interface ModalProductAddToCartProps {
  onClose: () => void;
  open: boolean;
  data: { compositeId: string };
}

const ModalProductAddToCart: FC<ModalProductAddToCartProps> = observer(
  ({ open, onClose, data }) => {
    const { cart } = useStores();
    const { loading, refetchProductsInTheCart } = cart;
    const handleDelete = () => {
      cart.removeProductFromCart(data.compositeId);
      onClose();
    };

    const handleClearCart = () => {
      cart.clearCart();
      onClose();
    };

    useEffect(() => {
      refetchProductsInTheCart();
    }, []);

    return (
      <Modal
        classes={{
          container: "flex flex-col w-full gap-6 max-w-2xl"
        }}
        open={open}
        onClose={onClose}
      >
        <Modal.Header classes={{
          wrapperHeader: "flex justify-start flex-col items-start"
        }} onClose={onClose}>
          <Button
            icons={{
              iconLeft: (
                <Icon
                  type="BasketIcon"
                  className="stroke-accent-content w-6 h-6"
                />
              )
            }}
            onClick={handleClearCart}
            color="transparent"
            className="text-accent-content underline"
          >
            Видалити всі товари
          </Button>
          <h3 className="text-black text-xl text-center font-bold">
            Товар доданий у кошик
          </h3>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="flex justify-center items-center py-36">
              <Icon type="SpinnerIcon" className="w-24 h-24" />
            </div>
          ) : (
            <ListCartCard
              isHideButtonReturnToShopping={true}
              classes={{
                wrapper: "!border-none !p-0 rounded-none",
                list: "!overflow-auto max-h-96 !px-2"
              }}
            />
          )}
        </Modal.Body>
        <Modal.Footer className="flex flex-col md:flex-row gap-2.5">
          <Button onClick={onClose} full color="second">
            Продовжити покупки
          </Button>
          <Button as="link" href="/cart/checkout" onClick={onClose} full>
            Оформити замовлення
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
);

export { ModalProductAddToCart };
