import { ComponentProps, FC } from "react";

interface FooterProps extends ComponentProps<"footer"> {}

const Footer: FC<FooterProps> = ({ children, ...props }) => {
  return <footer {...props}>{children}</footer>;
};
export { Footer };
