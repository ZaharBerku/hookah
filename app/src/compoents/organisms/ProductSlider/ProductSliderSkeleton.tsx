import { CardSkeleton } from "@/compoents/organisms";

const ProductSliderSkeleton = () => {
  return (
    <div className="flex gap-4 md:gap-5 overflow-hidden w-full">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
};

export { ProductSliderSkeleton };
