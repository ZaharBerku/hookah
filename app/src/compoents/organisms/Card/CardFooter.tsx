import { Button } from "@/compoents/atoms";
import { Liker } from "@/compoents/molecules";
import { FC } from "react";

import { CardProps } from "./index";

interface CardFooterProps extends Pick<CardProps, "likes"> {}

const CardFooter: FC<CardFooterProps> = ({ likes }) => {
  return (
    <div className="flex w-full gap-2 md:gap-4">
      <Liker likes={likes} />
      <Button full>Купити</Button>
    </div>
  );
};

export { CardFooter };
