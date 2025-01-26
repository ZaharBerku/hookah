import { FC, PropsWithChildren } from "react";

interface ModalFooterProps extends PropsWithChildren {
  className?: string;
  displayName?: string;
}

const ModalFooter: FC<ModalFooterProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export { ModalFooter };
