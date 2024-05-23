import { RadioButton, RadioButtonProps } from "@/compoents/atoms";
import clsx from "clsx";
import { FC } from "react";

interface ColorProps extends RadioButtonProps {
  color: string;
}

const Color: FC<ColorProps> = (props) => {
  const { disabled, onChange, color, checked } = props;
  return (
    <RadioButton
      disabled={disabled}
      onChange={onChange}
      value={color}
      name={"color"}
      classes={{
        label: clsx("cursor-pointer", {
          "cursor-grab": disabled
        })
      }}
      checked={checked}
    >
      <span
        style={{
          backgroundColor: color
        }}
        className="w-7 h-7 md:w-9 md:h-9 block border border-black border-opacity-20 rounded-full"
      ></span>
    </RadioButton>
  );
};

export { Color };
