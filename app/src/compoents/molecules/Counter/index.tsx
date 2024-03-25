"use client";

import { Button, Field } from "@/compoents/atoms";
import { ChangeEvent, useState } from "react";

const Counter = () => {
  const [number, setNumber] = useState<number>(0);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const newValue = parseInt(value, 10) || 0;
    if (+newValue >= 0) {
      setNumber(+newValue);
    }
  };

  const handleDecrease = () => {
    setNumber((currentNumber) => {
      const number = currentNumber - 1;
      if (number >= 0) {
        return number;
      }
      return currentNumber;
    });
  };

  const handleIncrease = () => {
    setNumber((currentNumber) => ++currentNumber);
  };

  return (
    <div className="flex border border-black rounded-2xl w-fit overflow-hidden">
      <Button
        onClick={handleDecrease}
        color="transparent"
        rounded="none"
        className="before:block before:h-0.5 before:bg-black hover:before:bg-white before:w-2.5 md:before:w-3 hover:bg-black before:rounded-full flex-[20%] !h-8 px-2 py-1.5 md:px-3 md:py-2.5"
      />
      <Field
        value={number.toString()}
        onChange={handleChange}
        className="max-w-10 md:max-w-12 w-full text-center font-semibold text-default leading-5 text-black rounded-none"
        classes={{
          wrapper: "flex-[60%]",
          containerInput: "!border-x border-y-0 rounded-none h-8 !py-0 !px-1"
        }}
        type="number"
        name="quantity"
      />
      <Button
        onClick={handleIncrease}
        color="transparent"
        rounded="none"
        className="before:block after:block before:h-0.5 after:h-0.5 before:bg-black after:bg-black after:w-2.5 before:w-2.5 md:before:w-3 md:after:w-3 after:absolute after:rotate-90 after:rounded-full before:rounded-full hover:before:bg-white hover:after:bg-white hover:bg-black flex-[20%] !h-8 px-2 py-1.5 md:px-3 md:py-2.5"
      />
    </div>
  );
};

export { Counter };
