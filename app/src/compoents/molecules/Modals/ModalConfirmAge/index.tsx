import { Modal, Button } from "@/compoents/atoms";
import { setCookie } from "cookies-next";
import Image from "next/image";
import { FC } from "react";

import { cookiesKeys } from "@/utils/variables";

interface ModalConfirmAgeProps {
  onClose: () => void;
  open: boolean;
}

const ModalConfirmAge: FC<ModalConfirmAgeProps> = ({ open, onClose }) => {
  const handleClickNo = () => {
    window.location.href = "https://www.google.com/";
  };

  const handleClickYes = () => {
    setCookie(cookiesKeys.isAdult, "true");
    onClose();
  };
  return (
    <Modal
      classes={{
        container:
          "flex flex-col items-center justify-center w-full gap-6 max-w-96"
      }}
      open={open}
      onClose={handleClickNo}
    >
      <Modal.Header>
        <Image
          width={160}
          height={160}
          src={"/images/adult.png"}
          alt={"adult"}
        />
      </Modal.Header>
      <Modal.Body>
        <h3 className="text-black text-xl text-center font-bold">
          Вам є 18 років?
        </h3>
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
