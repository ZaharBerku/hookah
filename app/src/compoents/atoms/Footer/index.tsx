import { PropsWithChildren, FC } from "react";

interface FooterProps extends PropsWithChildren {}

const Footer: FC<FooterProps> = ({ children }) => {
  return <footer>{children}</footer>;
};
export { Footer };
