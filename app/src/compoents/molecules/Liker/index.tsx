"use client";

import { Icon, Button } from "@/compoents/atoms";
import { useState } from "react";

const Liker = () => {
  const [like, setLike] = useState(0);

  return (
    <Button
      color="second"
      className="flex justify-between overflow-hidden hover:bg-white group active:bg-white h-10"
    >
      <Icon
        type="LikeIcon"
        className="w-5 h-5 md:w-6 md:h-6 stroke-black flex-[60%] mx-3 group-hover:fill-black"
      />
      <span className="bg-accent-base flex-[40%] text-xxs leading-5 py-2.5 px-3 font-bold text-black">
        {like}
      </span>
    </Button>
  );
};

export { Liker };
