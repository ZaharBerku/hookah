import { createComponent } from "@/utils/helpers";
import clsx from "clsx";
import type { FC } from "react";

import { sizes } from "./index.constants";
import type { TypographyProps } from "./index.types";

const Typography: FC<TypographyProps> = ({
  tag = "p",
  text = null,
  className,
  ...props
}) => {
  const Component = createComponent<HTMLHeadingElement>();
  return (
    <Component
      tag={tag}
      insideContent={text}
      className={clsx(sizes[tag], className)}
      {...props}
    />
  );
};

export { Typography };
