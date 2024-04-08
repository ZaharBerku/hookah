import cx from "clsx";
import { FC, ComponentProps } from "react";

interface WrapperProps extends ComponentProps<"div"> {}

const Wrapper: FC<WrapperProps> = ({ children, className, ...props }) => {
  return (
    <section
      className={cx("max-w-screen-xl m-auto px-4", className)}
      {...props}
    >
      {children}
    </section>
  );
};

export { Wrapper };
