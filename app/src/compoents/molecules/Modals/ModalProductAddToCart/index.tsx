"use client";

import { Modal, Button, Icon } from "@/compoents/atoms";
import { ListCartCardSkeleton } from "@/compoents/organisms";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { FC, useEffect, memo } from "react";

import { useStores } from "@/hooks";
import { modalNames } from "@/utils/variables";

const ListCartCard = dynamic(() => import("../../../organisms/ListCartCard"), {
  ssr: false,
  loading: () => <ListCartCardSkeleton />
});

export interface ModalProductAddToCartProps {
  onClose: () => void;
  open: boolean;
  data: { compositeId: string };
}

const ModalProductAddToCart: FC<ModalProductAddToCartProps> = memo(
  observer(({ open, onClose, data }) => {
    const { cart, modal } = useStores();
    const { loading, refetchProductsInTheCart } = cart;
    const numberOfProductsInCart = cart.calculeteTotalProductQuantity();

    useEffect(() => {
      refetchProductsInTheCart();
    }, []);

    const handleClearCart = () => {
      cart.clearCart();
      onClose();
    };

    const handleOpenModalClearCart = () => {
      modal.data = {
        [modalNames.ModalDeleteProductFromCart]: {
          action: handleClearCart,
          title: "Ви впевнені, що хочете очистити корзину?"
        }
      };
      modal.openModal(modalNames.ModalDeleteProductFromCart);
    };

    return (
      <Modal
        classes={{
          container: "flex flex-col w-full gap-6 max-w-2xl"
        }}
        open={open}
        onClose={onClose}
      >
        <Modal.Header
          classes={{
            wrapperHeader: "flex justify-start flex-col items-start"
          }}
          onClose={onClose}
        >
          <Button
            icons={{
              iconLeft: (
                <Icon
                  type="BasketIcon"
                  className={clsx("stroke-accent-content w-6 h-6", {
                    "stroke-slate-300": !cart.cart.length
                  })}
                />
              )
            }}
            disabled={!cart.cart.length}
            onClick={handleOpenModalClearCart}
            color="transparent"
            className="text-accent-content underline disabled:!bg-transparent disabled:!text-slate-300"
          >
            Видалити всі товари
          </Button>
          <h3 className="text-black text-xl text-center font-bold">
            Товар доданий у кошик
          </h3>
        </Modal.Header>
        <Modal.Body>
          <span>Товарів у кошику: {numberOfProductsInCart}</span>
          <div className="border-b border-black border-opacity-10 pb-4 mb-4 md:pb-6 md:mb-6">
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
          </div>
          <div className="flex items-center gap-1 justify-end">
            <span className="text-lg font-bold">Загальна сума:</span>{" "}
            <span className="text-primary font-bold text-base-xl-serif">
              ₴{cart.amountWithDiscount}
            </span>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex flex-col md:flex-row gap-2.5">
          <Button onClick={onClose} full color="second">
            Продовжити покупки
          </Button>
          <Button
            disabled={!cart.cart.length}
            as="link"
            href="/cart/checkout"
            className={clsx({
              "bg-gradient-primary-disabled": !cart.cart.length
            })}
            onClick={onClose}
            full
          >
            Оформити замовлення
          </Button>
        </Modal.Footer>
      </Modal>
    );
  })
);

export { ModalProductAddToCart };
