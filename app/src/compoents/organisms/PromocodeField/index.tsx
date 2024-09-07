import { Button, Field } from "@/compoents/atoms";
import { CHECK_PROMOCODE } from "@/query/promocode";
import { useLazyQuery } from "@apollo/client";
import clsx from "clsx";
import { setCookie, getCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import { ChangeEvent, FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useStores } from "@/hooks";
import { cookiesKeys } from "@/utils/variables";

interface PromocodeFieldProps {}

const PromocodeField: FC<PromocodeFieldProps> = () => {
  const { cart } = useStores();
  const [checkPromocode, { loading }] = useLazyQuery(CHECK_PROMOCODE);
  const t = useTranslations("Button.Promocode");
  const [error, setError] = useState(false);
  const [isPromocodeActive, setIsPromocodeActive] = useState(false);
  const [value, setValue] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isPromocodeActive) {
      setIsPromocodeActive(false);
    }
    if (error) {
      setError(false);
    }
    const value = event.target.value;
    setValue(value);
  };

  const handleCheckPromocode = async (initValue?: string) => {
    const result = await checkPromocode({
      variables: {
        name: value || initValue
      }
    });
    const promocode = result?.data?.promocodes?.data?.at(0)?.attributes;
    if (promocode) {
      const currentDate = new Date();
      const dateStart = new Date(promocode?.dateStart);
      const dateEnd = new Date(promocode?.dateEnd);
      const isPromocodeActive =
        currentDate >= dateStart && currentDate <= dateEnd;
      setIsPromocodeActive(isPromocodeActive);
      const ONE_HOURE = 60 * 60;
      setCookie(cookiesKeys.promocode, value || initValue, {
        maxAge: ONE_HOURE
      });
      cart.setPromocode(promocode);
      if (!initValue) {
        toast.success("Промокод був активований! 🔥");
      }
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    const inititlaValue = getCookie(cookiesKeys.promocode);
    if (inititlaValue) {
      setValue(inititlaValue);
      handleCheckPromocode(inititlaValue);
    }
  }, []);

  return (
    <Field
      value={value}
      onChange={handleChange}
      name={"name"}
      helperText={
        error
          ? "Промокод не дійсний"
          : isPromocodeActive
            ? "Промокод був активований"
            : ""
      }
      placeholder="Промокод"
      classes={{
        containerInput: clsx("gap-3 pr-0 !rounded-md", {
          "!border-sour": value && isPromocodeActive
        }),
        label: clsx({ "!text-sour": value && isPromocodeActive }),
        helperText: clsx({ "!text-sour": value && isPromocodeActive })
      }}
      sideElements={{
        right: (
          <Button
            onClick={() => handleCheckPromocode()}
            color="accent"
            disabled={loading}
            type="button"
            rounded="none"
            className="!h-12 md:!h-full -mr-px md:mr-0 px-3 !text-base md:px-6 !rounded-r-md"
          >
            {t("text")}
          </Button>
        )
      }}
      label={"Ваш промокод"}
      full
    />
  );
};

export { PromocodeField };
