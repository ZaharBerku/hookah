"use client";

import { Color } from "@/compoents/molecules";
import clsx from "clsx";
import { ChangeEvent, FC, useState } from "react";

interface ColorsProps {
  colors: any;
  disabled?: boolean;
}

const Colors: FC<ColorsProps> = ({ colors, disabled }) => {
  const [selectColor, setSelectColor] = useState<string | null>(null);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectColor(event.target.value);
  };

  const isChecked = (value: string) => selectColor === value;
  return (
    <form>
      <fieldset className="flex gap-3">
        <legend>Колір колби</legend>
        {colors?.map((color: any, index: number) => {
          return (
            <Color
              key={index}
              disabled={disabled}
              onChange={handleChange}
              value={color}
              name={"color"}
              classes={{
                label: clsx("cursor-pointer", {
                  "cursor-grab": disabled
                })
              }}
              checked={isChecked(color)}
              color={color}
            />
          );
        })}
      </fieldset>
    </form>
  );
};

export { Colors };
