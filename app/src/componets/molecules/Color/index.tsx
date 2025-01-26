import { Icon } from "@/componets/atoms";
import clsx from "clsx";
import Image from "next/image";
import { FC } from "react";

import { Link } from "@/utils/navigation";

interface ColorProps {
  href: string;
  color: string;
  isSelected: boolean;
  imageData: {
    url: string;
    alternativeText: string;
  };
}

const Color: FC<ColorProps> = (props) => {
  const { href, color, isSelected, imageData } = props;

  return (
    <Link
      href={href}
      style={{
        backgroundColor: color || "transparent"
      }}
      className={clsx(
        "w-7 h-7 md:w-9 md:h-9 flex overflow-hidden relative justify-center items-center border border-black border-opacity-20 rounded-full",
        {
          "shadow-circle shadow-primary": isSelected
        }
      )}
    >
      {imageData && (
        <Image
          fill
          src={imageData.url}
          loading="lazy"
          alt={imageData.alternativeText || "color"}
        />
      )}
      {isSelected && (
        <Icon
          type="CheckIcon"
          className={clsx("fill-white w-4 h-4 relative z-10 md:w-6 md:h-6", {
            "!fill-black": color === "#ffffff"
          })}
        />
      )}
    </Link>
  );
};

export { Color };
