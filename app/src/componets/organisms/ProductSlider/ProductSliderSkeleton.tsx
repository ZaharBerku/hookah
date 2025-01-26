import { CardSkeleton } from "@/componets/organisms";

const ProductSliderSkeleton = () => {
  return (
    <div className="flex gap-4 md:gap-5 overflow-hidden w-full">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton className="hidden md:flex " />
      <CardSkeleton className="hidden lg:flex" />
    </div>
  );
};

export { ProductSliderSkeleton };
