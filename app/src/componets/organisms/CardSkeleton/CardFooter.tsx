import { Skeleton } from "@nextui-org/skeleton";
import { FC } from "react";

const CardFooter: FC = () => {
  return (
    <div className="flex w-full gap-2 md:gap-4">
      <Skeleton
        className={"rounded-md h-11 md:h-12 w-full max-w-14 md:max-w-23"}
      />
      <Skeleton className={"rounded-md h-11 md:h-12 w-full"} />
    </div>
  );
};

export { CardFooter };
