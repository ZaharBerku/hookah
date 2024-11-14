import { CardSkeleton } from "@/compoents/organisms";

const ProductSliderSkeleton = () => {
  return (
    <div className="flex gap-4 md:gap-5 overflow-hidden w-full">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton className="hidden lg:flex" />
      <CardSkeleton className="hidden xl:flex" />
    </div>
  );
};

export { ProductSliderSkeleton };
