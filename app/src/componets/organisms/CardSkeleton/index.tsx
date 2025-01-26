import clsx from "clsx";
import { FC } from "react";

import { CardBody } from "./CardBody";
import { CardFooter } from "./CardFooter";
import { CardHeader } from "./CardHeader";

interface CardSkeletonProps {
  className?: string;
}

const CardSkeleton: FC<CardSkeletonProps> = ({ className }) => {
  return (
    <article
      className={clsx(
        "max-w-49 flex-1 md:max-w-74 cursor-pointer flex flex-col justify-center items-center w-full h-full gap-2 md:gap-4 relative",
        className
      )}
    >
      <CardHeader />
      <CardBody />
      <CardFooter />
    </article>
  );
};

export { CardSkeleton };
