import clsx from "clsx";
import { ComponentProps, FC } from "react";

interface CheckboxProps extends ComponentProps<"input"> {
  label?: string;
}

const Checkbox: FC<CheckboxProps> = ({ label, className, ...props }) => {
  return (
    <div className="flex gap-2 items-center">
      <label className="cursor-pointer flex gap-2 items-center text-base text-black text-opacity-60">
        <span
          className={clsx(
            "h-8 w-8 border border-light-dark-accent rounded flex justify-center items-center relative",
            {
              "before:block before:bg-black before:w-2.5 before:h-2.5 before:rounded-full":
                props.checked
            }
          )}
        ></span>
        <input
          type="checkbox"
          className={clsx("hidden", className)}
          {...props}
        />
        {label}
      </label>
    </div>
  );
};

export { Checkbox };
