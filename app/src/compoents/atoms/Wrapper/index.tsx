import { FC, ComponentProps } from "react";

interface WrapperProps extends ComponentProps<"div"> {}

const Wrapper: FC<WrapperProps> = ({ children, ...props }) => {
  return (
    <div className="max-w-screen-xl m-auto px-4" {...props}>
      {children}
    </div>
  );
};

export { Wrapper };
