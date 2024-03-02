import { FC, ComponentProps } from "react";

interface MainProps extends ComponentProps<"main"> {}

const Main: FC<MainProps> = ({ children }) => {
  return <main>{children}</main>;
};
export { Main };
