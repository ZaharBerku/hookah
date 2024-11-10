import { Modal, Button } from "@/compoents/atoms";
import { setCookie } from "cookies-next";
import Image from "next/image";
import { FC } from "react";

import { cookiesKeys } from "@/utils/variables";

export interface ModalConfirmAgeProps {
  onClose: () => void;
  open: boolean;
}

const ModalConfirmAge: FC<ModalConfirmAgeProps> = ({ open, onClose }) => {
  const handleClickNo = () => {
    window.location.href = "https://www.disney.com/";
  };

  const handleClickYes = () => {
    setCookie(cookiesKeys.isAdult, "true");
    onClose();
  };
  return (
    <Modal
      classes={{
        container:
          "flex flex-col items-center justify-center w-full gap-6 max-w-148"
      }}
      open={open}
      onClose={handleClickNo}
    >
      <Modal.Header
        classes={{
          wrapperHeader: "flex justify-center items-center"
        }}
      >
        <div className="w-40 h-40 relative">
          <Image
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={75}
            src={"/images/adult.png"}
            alt={"adult"}
          />
        </div>
      </Modal.Header>
      <Modal.Body className="flex flex-col gap-4 items-center justify-center">
        <h3 className="text-black text-lg md:text-xl text-center font-bold">
          Вам виповнилося 18 років?
        </h3>
        <p className="text-center">
          Натискаючи «Так» ви надаєте згоду на отримання інформації про
          продукцію, що представлена на сайті, за допомогою засобів
          дистанційного зв’язку згідно з ч. 2 ст. 15 Закону України «Про захист
          прав споживачів».
        </p>
      </Modal.Body>
      <Modal.Footer className="flex gap-2.5 w-full">
        <Button onClick={handleClickNo} full color="second">
          Ні
        </Button>
        <Button onClick={handleClickYes} full>
          Так
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { ModalConfirmAge };
