import { Skeleton } from "@nextui-org/skeleton";

const FilterSkeleton = () => {
  return (
    <div className="w-full hidden md:flex h-[calc(100vh-120px)] md:max-w-74 flex-col gap-10 md:border md:border-black md:border-opacity-10 rounded-3xl px-6 py-5 overflow-auto sticky top-24">
      <div className="flex flex-col w-full gap-5">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="rounded w-20 h-8" />
          <Skeleton className="rounded w-8 h-8" />
        </div>
        <div className="flex gap-4 items-center">
          <Skeleton className="rounded min-w-8 h-8" />
          <Skeleton className="rounded w-full h-8" />
        </div>
        <div className="flex gap-4 items-center">
          <Skeleton className="rounded min-w-8 h-8" />
          <Skeleton className="rounded w-full h-8" />
        </div>
        <div className="flex gap-4 items-center">
          <Skeleton className="rounded min-w-8 h-8" />
          <Skeleton className="rounded w-full h-8" />
        </div>
        <div className="flex gap-4 items-center">
          <Skeleton className="rounded min-w-8 h-8" />
          <Skeleton className="rounded w-full h-8" />
        </div>
      </div>
      <div className="flex flex-col w-full gap-5">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="rounded w-20 h-8" />
          <Skeleton className="rounded w-8 h-8" />
        </div>
        <div className="flex gap-4 items-center">
          <Skeleton className="rounded min-w-8 h-8" />
          <Skeleton className="rounded w-full h-8" />
        </div>
        <div className="flex gap-4 items-center">
          <Skeleton className="rounded min-w-8 h-8" />
          <Skeleton className="rounded w-full h-8" />
        </div>
        <div className="flex gap-4 items-center">
          <Skeleton className="rounded min-w-8 h-8" />
          <Skeleton className="rounded w-full h-8" />
        </div>
        <div className="flex gap-4 items-center">
          <Skeleton className="rounded min-w-8 h-8" />
          <Skeleton className="rounded w-full h-8" />
        </div>
      </div>
    </div>
  );
};

export { FilterSkeleton };
