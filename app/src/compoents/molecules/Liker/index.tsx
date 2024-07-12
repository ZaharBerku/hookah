"use client";

import { Icon, Button } from "@/compoents/atoms";
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

    localStorage?.setItem(localStorageKeys.likes, JSON.stringify(newArrayLikes));

    setLike((currentValue) => !currentValue);
    toast.success(index === -1 ? t("like") : t("dislike"));
    try {
      const newLikes = index === -1 ? +likes + 1 : +likes - 1;
      console.log(newLikes, "newLikes");
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
      className="flex justify-between overflow-hidden py-2.5 px-1 md:hover:bg-white group active:bg-white h-10 w-16 md:w-20"
    >
      <Icon
        type="LikeIcon"
        className={cx(
          "w-5 h-5 md:w-6 md:h-6 stroke-black flex-[60%] md:group-hover:fill-black",
          { "fill-black": like }
        )}
      />

      <span className="bg-accent-base flex-[40%] text-xxs leading-5  font-bold text-black">
        {+likes + +like}
      </span>
    </Button>
  );
};

export { Liker };
