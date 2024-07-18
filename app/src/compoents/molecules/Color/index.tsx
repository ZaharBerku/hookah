import { Icon } from "@/compoents/atoms";
import clsx from "clsx";
import { FC } from "react";

import { Link } from "@/utils/navigation";

interface ColorProps {
  href: string;
  color: string;
  isSelected: boolean;
}

const Color: FC<ColorProps> = (props) => {
  const { href, color, isSelected } = props;

  return (
    <Link
      href={href}
      style={{
        backgroundColor: color
      }}
      className="w-7 h-7 md:w-9 md:h-9 flex justify-center items-center border border-black border-opacity-20 rounded-full"
    >
      {isSelected && (
        <Icon
          type="CheckIcon"
          className={clsx("fill-white w-6 h-6", {
            "!fill-black": color === "#ffffff"
          })}
        />
      )}
    </Link>
  );
};

export { Color };
