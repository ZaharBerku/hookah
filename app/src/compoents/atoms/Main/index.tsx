import { PropsWithChildren, FC } from "react";

interface MainProps extends PropsWithChildren {}

const Main: FC<MainProps> = ({ children }) => {
  return <main>{children}</main>;
};
export { Main };
