import { PropsWithChildren, FC } from "react";

interface HeaderProps extends PropsWithChildren {}

const Header: FC<HeaderProps> = ({ children }) => {
  return <header>{children}</header>;
};
export { Header };
