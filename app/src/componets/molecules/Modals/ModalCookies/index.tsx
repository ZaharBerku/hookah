import { Modal, Button, Icon } from "@/componets/atoms";
import { setCookie } from "cookies-next";
import { FC } from "react";

import { cookiesKeys } from "@/utils/variables";

export interface ModalCookiesProps {
  onClose: () => void;
  open: boolean;
  isStopScroll?: boolean;
}

const ModalCookies: FC<ModalCookiesProps> = ({
  open,
  onClose,
  isStopScroll
}) => {
  const handleClose = () => {
    setCookie(cookiesKeys.isCookies, false);
    onClose();
  };

  const handleAccept = () => {
    setCookie(cookiesKeys.isCookies, true);
    onClose();
  };

  return (
    <Modal
      isStopScroll={isStopScroll}
      classes={{
        wrapper:
          "!translate-y-0 !top-auto max-w-96 md:!translate-x-0 !bottom-4 md:!left-4 !justify-start",
        container:
          "flex flex-col items-center justify-start w-full gap-6 !px-5 shadow-3xl shadow-card-shadow-color",
        background: "hidden"
      }}
      open={open}
      onClose={handleClose}
    >
      <Modal.Header onClose={handleClose}>
        <h3 className="text-black text-base font-bold gap-2 text-start flex items-center w-full">
          <Icon type="CookiesIcon" className="fill-black" />
          Наш сайт використовує cookies
        </h3>
      </Modal.Header>
      <Modal.Body>
        <p className="text-start text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          mollis nunc a molestie dictum. Mauris venenatis, felis scelerisque
          aliquet lacinia
        </p>
      </Modal.Body>
      <Modal.Footer className="flex gap-2.5 w-full">
        <Button onClick={handleAccept} className="px-10">
          Прийняти
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { ModalCookies };
