import { Modal, Button, Icon } from "@/compoents/atoms";
import { FC } from "react";

interface ModalCookiesProps {
  onClose: () => void;
  open: boolean;
}

const ModalCookies: FC<ModalCookiesProps> = ({ open, onClose }) => {
  return (
    <Modal
      classes={{
        wrapper: "!bottom-0 md:!bottom-4 md:!left-4",
        container:
          "flex flex-col items-center justify-center w-full gap-6 max-w-96",
        background: "hidden"
      }}
      open={open}
      onClose={onClose}
    >
      <Modal.Header onClose={onClose}>
        <h3 className="text-black text-xl font-bold flex gap-1 text-start">
          <Icon type="CookiesIcon" />
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
        <Button>Прийняти</Button>
      </Modal.Footer>
    </Modal>
  );
};

export { ModalCookies };
