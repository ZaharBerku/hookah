import clsx from "clsx";
import { FC, ComponentProps } from "react";

export interface RadioButtonProps extends ComponentProps<"input"> {
  classes?: {
    label?: string;
  };
}

const RadioButton: FC<RadioButtonProps> = ({
  classes,
  children,
  className,
  ...props
}) => {
  return (
    <label className={clsx("relative", classes?.label)}>
      <input className={clsx("invisible w-0 h-0 absolute", className)} {...props} type="radio" />
      {children}
    </label>
  );
};

export { RadioButton };
