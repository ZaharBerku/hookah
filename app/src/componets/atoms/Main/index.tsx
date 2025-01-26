import { FC, ComponentProps } from "react";

interface MainProps extends ComponentProps<"main"> {}

const Main: FC<MainProps> = ({ children, ...props }) => {
  return <main {...props}>{children}</main>;
};
export { Main };
