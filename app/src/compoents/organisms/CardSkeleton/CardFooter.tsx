import { FC } from "react";
import { Skeleton } from "@nextui-org/skeleton";


const CardFooter: FC = () => {
  return (
    <div className="flex w-full gap-2 md:gap-4">
      <Skeleton className={"rounded-9xl h-10 w-full max-w-14 md:max-w-23"}/>
      <Skeleton className={"rounded-9xl h-8 md:h-10 w-full"}/>
    </div>
  );
};

export { CardFooter };
