import includedIcons from "@assets/icons";
import type { FC } from "react";

import type { IconProps } from "./index.types";

const Icon: FC<IconProps> = ({ type, className, onClick, ...props }) => {
  const IconSelected = (includedIcons as any)[type];

  if (!IconSelected) {
    console.error(`Icon with type ${type} is not included.`);
    return null;
  }

  return <IconSelected className={className} onClick={onClick} {...props} />;
};

export { Icon };
