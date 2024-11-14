import { Skeleton } from "@nextui-org/skeleton";

const MainSliderSkeleton = () => {
  return (
    <section className="flex gap-10 w-full relative">
      <div className="hidden md:block relative max-w-74 w-full">
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
      <div className="flex-1">
        <Skeleton className="aspect-[8/3] w-full rounded-lg mb-4" />
      </div>
    </section>
  );
};

export { MainSliderSkeleton };
