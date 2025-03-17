import { Modal, Button } from "@/componets/atoms";
import Image from "next/image";
import { FC } from "react";

import { useRouter } from "@/utils/navigation";

export interface ModalCompletionOrderProps {
  onClose: () => void;
  open: boolean;
}

const ModalCompletionOrder: FC<ModalCompletionOrderProps> = ({
  open,
  onClose
}) => {
  const router = useRouter();
  const handleReturnToShopping = () => {
    router.replace("/");
    onClose();
  };

  return (
    <Modal
      classes={{
        container:
          "flex flex-col items-center justify-center w-full gap-6 max-w-xl"
      }}
      open={open}
      onClose={handleReturnToShopping}
    >
      <Modal.Header
        classes={{
          wrapperHeader: "flex justify-center items-center"
        }}
      >
        <div className="max-w-80 relative h-80 w-full">
          <Image
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            unoptimized
            src={"/images/avatar-grass.png"}
            alt={"grass"}
          />
        </div>
      </Modal.Header>
      <Modal.Body>
        <h3 className="text-black text-xl text-center font-bold">
          Ваше замовлення прийняте. <br /> Наш менеджер зв’яжется з Вами.
        </h3>
      </Modal.Body>
      <Modal.Footer className="flex gap-2.5 w-full">
        <Button onClick={handleReturnToShopping} full>
          Повернутиcь до покупок
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { ModalCompletionOrder };
