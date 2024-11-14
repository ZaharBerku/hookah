import { Skeleton } from "@nextui-org/skeleton";
import { FC } from "react";

const CardHeader: FC = () => {
  return (
    <div className="overflow-hidden bg-white relative h-40 md:h-74 w-full shadow-4xl rounded-2xl shadow-card-shadow-color">
      <Skeleton className="rounded-lg absolute h-full inset-0" />
    </div>
  );
};

export { CardHeader };
