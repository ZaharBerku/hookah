import { Skeleton } from "@nextui-org/skeleton";
import { FC } from "react";

const CardBody: FC = () => {
  return (
    <div className="w-full flex flex-col gap-2 md:gap-4">
      <Skeleton className={"rounded-lg h-5"} />
      <div className="flex items-center gap-3 md:gap-4">
        <Skeleton className={"rounded-lg max-w-32 w-full h-6"}>
          <span className="text-lg"></span>
        </Skeleton>
      </div>
    </div>
  );
};

export { CardBody };
