import { FC, PropsWithChildren } from "react";

interface ModalBodyProps extends PropsWithChildren {
  className?: string;
  displayName?: string;
}

const ModalBody: FC<ModalBodyProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export { ModalBody };
