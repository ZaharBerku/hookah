"use client";

import { Icon, Button } from "@/componets/atoms";
import { UPDATE_LIKES_MUTATION } from "@/query/schema";
import { useMutation } from "@apollo/client";
import cx from "clsx";
import { useTranslations } from "next-intl";
import { FC, useEffect, useState, MouseEvent } from "react";
import toast from "react-hot-toast";

import { localStorageKeys } from "@/utils/variables";

interface LikerPops {
  likes: string;
  id: string;
  odId: string;
}

const Liker: FC<LikerPops> = ({ likes, odId, id }) => {
  const [like, setLike] = useState(false);
  const [updateLikes] = useMutation(UPDATE_LIKES_MUTATION);
  const t = useTranslations("Toaster");
  const handleToggleLike = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const arrayIdCardLiked =
      JSON.parse(localStorage?.getItem(localStorageKeys.likes) || "null") || [];
    const index = arrayIdCardLiked.indexOf(odId);
    const newArrayLikes =
      index === -1
        ? [...arrayIdCardLiked, odId]
        : (arrayIdCardLiked.splice(index, 1), arrayIdCardLiked);

    localStorage?.setItem(
      localStorageKeys.likes,
      JSON.stringify(newArrayLikes)
    );

    setLike((currentValue) => !currentValue);
    toast.success(index === -1 ? t("like") : t("dislike"));
    try {
      const newLikes = index === -1 ? +likes + 1 : +likes - 1;
      updateLikes({
        variables: {
          odId,
          data: {
            likes: newLikes
          }
        }
      });
    } catch (err) {
      console.error("Error updating likes:", err);
    }
  };

  useEffect(() => {
    const arrayIdCardLiked = localStorage?.getItem(localStorageKeys.likes);
    if (arrayIdCardLiked) {
      setLike(arrayIdCardLiked.includes(odId));
    }
  }, []);

  return (
    <Button
      data-like={id}
      onClick={handleToggleLike}
      color="second"
      className="flex justify-between overflow-hidden !border-custom-accent-base hover:!border-black md:hover:bg-white group active:bg-white h-10 min-w-16 md:!min-w-23"
    >
      <span className="flex justify-center items-center px-1 flex-[60%] md:flex-[50%]">
        <Icon
          type="LikeIcon"
          className={cx("w-6 h-6 stroke-black md:group-hover:fill-black", {
            "fill-black": like
          })}
        />
      </span>
      <span className="bg-custom-accent-base flex justify-center items-center h-full py-2.5 px-1 w-full flex-[40%] md:flex-[50%] text-xxs leading-5 font-bold text-black">
        {+likes + +like}
      </span>
    </Button>
  );
};

export { Liker };
