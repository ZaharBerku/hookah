import { ColorSkeleton } from "@/componets/molecules";
import { Skeleton } from "@nextui-org/skeleton";

const ColorsSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-5 w-14 mb-4 rounded-md" />
      <div className="flex gap-4 flex-wrap">
        <ColorSkeleton />
        <ColorSkeleton />
        <ColorSkeleton />
        <ColorSkeleton />
        <ColorSkeleton />
      </div>
    </div>
  );
};

export { ColorsSkeleton };
