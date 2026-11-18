import { Button, Icon } from "@/componets/atoms";
import clsx from "clsx";
import { FC } from "react";

interface PaginationButtonProps {
  handleClick: () => void;
  type: "left" | "right";
  label?: string;
  className?: string;
}

const PaginationButton: FC<PaginationButtonProps> = ({
  handleClick,
  type,
  label,
  className
}) => {
  return (
    <Button
      onClick={handleClick}
      type="button"
      aria-label={label}
      className={clsx(
        "flex justify-center items-center !bg-custom-accent-base min-w-11 max-h-11 rounded-full",
        className
      )}
      color="transparent"
    >
      <Icon
        type={"ArrowRightIcon"}
        className={clsx("w-6 h-5 stroke-black", {
          "rotate-180": type === "left"
        })}
      />
    </Button>
  );
};

export { PaginationButton };
