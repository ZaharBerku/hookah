"use client";

import { Icon, Button } from "@/compoents/atoms";
import cx from "clsx";
import { FC, useState } from "react";

interface LikerPops {
  likes: number;
}

const Liker: FC<LikerPops> = ({ likes }) => {
  const [like, setLike] = useState(false);

  const handleToggleLike = () => {
    setLike((currentValue) => !currentValue);
  };

  return (
    <Button
      onClick={handleToggleLike}
      color="second"
      className="flex justify-between overflow-hidden md:hover:bg-white group active:bg-white h-10 w-full max-w-14 md:max-w-23"
    >
      <Icon
        type="LikeIcon"
        className={cx(
          "w-5 h-5 md:w-6 md:h-6 stroke-black flex-[60%] md:group-hover:fill-black",
          { "fill-black": like }
        )}
      />
      <span className="bg-accent-base flex-[40%] text-xxs leading-5 py-2.5 px-1 md:px-3 font-bold text-black">
        {likes + +like}
      </span>
    </Button>
  );
};

export { Liker };
