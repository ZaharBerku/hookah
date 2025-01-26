import { FC, ComponentProps } from "react";

interface HeaderProps extends ComponentProps<"header"> {}

const Header: FC<HeaderProps> = ({ children, ...props }) => {
  return <header {...props}>{children}</header>;
};
export { Header };
