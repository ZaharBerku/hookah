
import { CardBody } from "./CardBody";
import { CardFooter } from "./CardFooter";
import { CardHeader } from "./CardHeader";

const CardSkeleton = () => {
  return (
    <article className="max-w-49 min-w-40 md:max-w-74 flex-1 cursor-pointer flex flex-col w-full gap-2 md:gap-4">
      <CardHeader />
      <CardBody />
      <CardFooter />
    </article>
  );
};

export { CardSkeleton };
