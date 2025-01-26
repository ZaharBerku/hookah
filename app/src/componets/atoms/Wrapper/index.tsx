import cx from "clsx";
import { FC, HTMLAttributes } from "react";

import { createComponent } from "@/utils/helpers";

interface WrapperProps extends HTMLAttributes<HTMLElement> {
  tag?: "div" | "section";
}

const Wrapper: FC<WrapperProps> = ({
  children,
  className,
  tag = "section",
  ...props
}) => {
  const Component = createComponent<HTMLElement>();
  return (
    <Component
      tag={tag}
      className={cx("max-w-screen-xl m-auto px-4", className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export { Wrapper };
