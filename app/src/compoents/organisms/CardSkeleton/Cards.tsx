import { CardSkeleton } from ".";

const Cards = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-auto-fill-card-mobile md:grid-cols-auto-fill-card relative before:block before:h-0.5 before:w-full before:absolute before:bottom-0 before:right-0 before:shadow-card-shadow-color before:bg-white before:shadow-4xl after:block after:w-0.5 after:shadow-card-shadow-color after:bg-white after:shadow-4xl after:top-0 after:bottom-0 after:absolute after:right-0">
        <CardSkeleton className="flex items-center justify-center border-r-2 border-light border-b-2 p-2 md:p-4" />
        <CardSkeleton className="flex items-center justify-center border-r-2 border-light border-b-2 p-2 md:p-4" />
        <CardSkeleton className="flex items-center justify-center border-r-2 border-light border-b-2 p-2 md:p-4" />
        <CardSkeleton className="flex items-center justify-center border-r-2 border-light border-b-2 p-2 md:p-4" />
        <CardSkeleton className="flex items-center justify-center border-r-2 border-light border-b-2 p-2 md:p-4" />
        <CardSkeleton className="flex items-center justify-center border-r-2 border-light border-b-2 p-2 md:p-4" />
        <CardSkeleton className="flex items-center justify-center border-r-2 border-light border-b-2 p-2 md:p-4" />
        <CardSkeleton className="flex items-center justify-center border-r-2 border-light border-b-2 p-2 md:p-4" />
        <CardSkeleton className="flex items-center justify-center border-r-2 border-light border-b-2 p-2 md:p-4" />
        <CardSkeleton className="flex items-center justify-center border-r-2 border-light border-b-2 p-2 md:p-4" />
      </div>
    </div>
  );
};

export { Cards };