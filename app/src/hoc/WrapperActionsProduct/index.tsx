import { MouseEvent, PropsWithChildren, FC } from "react";

interface WrapperActionsProductProps extends PropsWithChildren {}

const WrapperActionsProduct: FC<WrapperActionsProductProps> = ({
  children
}) => {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const cardElement = (event.target as HTMLDivElement)?.closest(
      "[data-card]"
    );
    const colorElement = (event.target as HTMLDivElement)?.closest(
      "[data-color]"
    );
  };

  return (
    <div className="w-full" onClick={handleClick}>
      {children}
    </div>
  );
};

export { WrapperActionsProduct };
