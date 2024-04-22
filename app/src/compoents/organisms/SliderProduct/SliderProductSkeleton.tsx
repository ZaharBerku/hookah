import { CardSkeleton } from "@/compoents/organisms";

const SliderProductSkeleton = () => {
  return (
    <div className="flex gap-4 md:gap-5 overflow-hidden w-full">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
};

export { SliderProductSkeleton };
