"use client";

import { Button, Field } from "@/compoents/atoms";
import { observer } from "mobx-react";
import { ChangeEvent, FC, useState } from "react";

import { useStores } from "@/hooks";

interface CounterProps {
  initialValue?: number;
  id?: number;
}

const Counter: FC<CounterProps> = observer(({ initialValue = 0, id }) => {
  const [number, setNumber] = useState<number>(initialValue);
  const { cart } = useStores();
  const isCorrectId = id !== null && id !== undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const newValue = parseInt(value, 10) || 0;
    const number = +newValue;
    if (number >= 0) {
      setNumber(number);
      if (isCorrectId) {
        cart.setNumberOfProductInCart(id, number);
      }
    }
  };

  const handleDecrease = () => {
    if (isCorrectId) {
      cart.decrementNumberOfProductInCart(id);
    }

    setNumber((currentNumber) => {
      const number = currentNumber - 1;
      if (number > 0) {
        return number;
      }
      return currentNumber;
    });
  };

  const handleIncrease = () => {
    if (isCorrectId) {
      cart.incrementNumberOfProductInCart(id);
    }
    setNumber((currentNumber) => {
      return ++currentNumber;
    });
  };

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      className="flex border border-black rounded-9xl w-fit overflow-hidden h-8 md:h-10"
    >
      <Button
        onClick={handleDecrease}
        color="transparent"
        rounded="none"
        className="before:block before:h-0.5 before:bg-black active:before:bg-white md:hover:before:bg-white before:w-2.5 md:before:w-3 active:bg-black md:hover:bg-black before:rounded-full flex-[20%] !h-8 md:!h-10 px-2 py-1.5 md:px-3 md:py-2.5"
      />
      <Field
        pattern={"[0-9]*"}
        value={number.toString()}
        onChange={handleChange}
        className="max-w-10 md:max-w-12 !h-8 md:!h-10 w-full text-center font-semibold text-default leading-5 !text-black rounded-none"
        classes={{
          wrapper: "flex-[60%] !h-8 md:!h-10",
          containerInput:
            "!border-x border-y-0 rounded-none !h-8 md:!h-10 !py-0 !px-1"
        }}
        type="number"
        name="quantity"
      />
      <Button
        onClick={handleIncrease}
        color="transparent"
        rounded="none"
        className="before:block after:block before:h-0.5 after:h-0.5 before:bg-black after:bg-black after:w-2.5 before:w-2.5 md:before:w-3 md:after:w-3 after:absolute after:rotate-90 after:rounded-full before:rounded-full active:before:bg-white md:hover:before:bg-white active:after:bg-white md:hover:after:bg-white active:bg-black md:hover:bg-black flex-[20%] !h-8 md:!h-10 px-2 py-1.5 md:px-3 md:py-2.5"
      />
    </div>
  );
});

export { Counter };
