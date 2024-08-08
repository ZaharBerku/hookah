"use client";

import { Button, Field } from "@/compoents/atoms";
import { observer } from "mobx-react";
import { useTranslations } from "next-intl";
import { ChangeEvent, FC, useState } from "react";

import { useStores } from "@/hooks";

interface CounterProps {
  initialValue?: number;
  compositeId?: string;
  availabilityQuantity: number;
}

const Counter: FC<CounterProps> = observer(
  ({ initialValue = 0, compositeId, availabilityQuantity }) => {
    const t = useTranslations("Button.Buy");
    const [number, setNumber] = useState<number>(initialValue);
    const { cart } = useStores();
    const isCorrectId = compositeId !== null && compositeId !== undefined;
    const available = availabilityQuantity - number;
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      const newValue = parseInt(value, 10) || 0;
      const number = +newValue;

      if (number >= 1 && availabilityQuantity - number >= 0) {
        setNumber(number);
        if (isCorrectId) {
          cart.setNumberOfProductInCart(compositeId, number);
        }
      }
    };

    const handleDecrease = () => {
      if (isCorrectId) {
        cart.decrementNumberOfProductInCart(compositeId);
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
      if (available > 0) {
        if (isCorrectId) {
          cart.incrementNumberOfProductInCart(compositeId);
        }
        setNumber((currentNumber) => {
          return ++currentNumber;
        });
      }
    };

    return (
      <div className="relative">
        <div
          onClick={(event) => event.stopPropagation()}
          className="flex border border-black rounded-9xl w-fit overflow-hidden h-8"
        >
          <Button
            onClick={handleDecrease}
            color="transparent"
            rounded="none"
            className="relative before:block before:h-0.5 before:bg-white active:before:bg-black md:hover:before:bg-black before:w-2.5 md:before:w-3 active:!bg-white md:hover:!bg-white before:rounded-full flex-[20%] !h-8 px-2 py-1.5 md:px-3 md:py-2.5 !bg-black"
          />
          <Field
            pattern={"[0-9]*"}
            value={number.toString()}
            onChange={handleChange}
            className="max-w-10 md:max-w-12 !h-8 w-full text-center font-semibold text-default leading-5 !text-black rounded-none"
            classes={{
              wrapper: "flex-[60%] !h-8",
              containerInput:
                "!border-x border-y-0 !rounded-none !h-8 !py-0 !px-1"
            }}
            type="number"
            name="quantity"
          />
          <Button
            onClick={handleIncrease}
            color="transparent"
            rounded="none"
            className="relative before:block after:block before:h-0.5 after:h-0.5 before:bg-white after:bg-white after:w-2.5 before:w-2.5 md:before:w-3 md:after:w-3 after:absolute after:rotate-90 after:rounded-full before:rounded-full active:before:bg-black md:hover:before:bg-black active:after:bg-black md:hover:after:bg-black active:!bg-white md:hover:!bg-white flex-[20%] !h-8 px-2 py-1.5 md:px-3 md:py-2.5 !bg-black"
          />
        </div>
        <span className="text-2xs mt-1 text-primary-green absolute whitespace-nowrap top-full right-0">
          {t("availability")}: {availabilityQuantity - number}
        </span>
      </div>
    );
  }
);

export { Counter };
