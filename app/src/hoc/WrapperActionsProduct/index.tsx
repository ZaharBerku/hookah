import { MouseEvent, PropsWithChildren, FC } from "react";

import { useRouter } from "@/utils/navigation";

interface WrapperActionsProductProps extends PropsWithChildren {}

const WrapperActionsProduct: FC<WrapperActionsProductProps> = ({
  children
}) => {
  const router = useRouter();
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const cardElement = (event.target as HTMLDivElement)?.closest(
      "[data-card]"
    );
    const colorElement = (event.target as HTMLDivElement)?.closest(
      "[data-color]"
    );
    if (cardElement && !colorElement) {
      const card = JSON.parse((cardElement as any)?.dataset.card);
      router.push(
        card.type
          ? `/${card.category}/${card.type}/${card.brand}/${card.compositeId}`
          : `/${card.category}/${card.brand}/${card.compositeId}`
      );
    }
  };

  return (
    <div className="w-full" onClick={handleClick}>
      {children}
    </div>
  );
};

export { WrapperActionsProduct };
