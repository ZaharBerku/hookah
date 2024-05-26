import clsx from "clsx";
import { FC } from "react";

interface ProductAvailabilityProps {
  available: boolean;
}

const ProductAvailability: FC<ProductAvailabilityProps> = ({ available }) => {
  return (
    <span
      className={clsx(
        "text-sm font-normal before:block before:h-full before:w-px flex gap-4",
        available
          ? "text-primary-green before:bg-primary-green"
          : "text-accent-content before:bg-accent-content "
      )}
    >
      {available ? "В наявності" : "Немає в наявності"}
    </span>
  );
};

export { ProductAvailability };
