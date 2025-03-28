import type { PropsWithChildren, FC } from "react";

interface WrapperActionsProductProps extends PropsWithChildren {}

const WrapperActionsProduct: FC<WrapperActionsProductProps> = ({
  children
}) => {
  return <div className="w-full">{children}</div>;
};

export { WrapperActionsProduct };
