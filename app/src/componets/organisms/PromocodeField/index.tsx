import { Button, Field } from "@/componets/atoms";
import { CHECK_PROMOCODE } from "@/query/promocode";
import { useLazyQuery } from "@apollo/client/react";
import clsx from "clsx";
import { setCookie, getCookie, deleteCookie } from "cookies-next/client";
import { useTranslations } from "next-intl";
import { ChangeEvent, FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useStores } from "@/hooks";
import { cookiesKeys } from "@/utils/variables";

interface PromocodeFieldProps {}

const PromocodeField: FC<PromocodeFieldProps> = () => {
  const { cart } = useStores();
  const [checkPromocode, { loading }] = useLazyQuery<any>(CHECK_PROMOCODE);
  const t = useTranslations("Button.Promocode");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPromocodeActive, setIsPromocodeActive] = useState(false);
  const [value, setValue] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isPromocodeActive) {
      setIsPromocodeActive(false);
    }
    if (errorMessage) {
      setErrorMessage(null);
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
    if (promocode && promocode.numberOfUses) {
      const currentDate = new Date();
      const dateStart = new Date(promocode?.dateStart);
      const dateEnd = new Date(promocode?.dateEnd);
      const isPromocodeActive =
        currentDate >= dateStart && currentDate <= dateEnd;
      if (isPromocodeActive) {
        const ONE_HOURE = 60 * 60;
        setCookie(cookiesKeys.promocode, value || initValue, {
          maxAge: ONE_HOURE
        });
        if (promocode.minAmount <= cart.amount) {
          cart.setPromocode(promocode);
          setIsPromocodeActive(isPromocodeActive);
        } else {
          setErrorMessage(
            `Мін. сума замовлення для активації промокоду ₴${promocode.minAmount}`
          );
        }
        if (!initValue) {
          toast.success("Промокод був активований! 🔥");
        }
      }
    } else {
      cart.setPromocode(null);
      deleteCookie(cookiesKeys.promocode);
      setErrorMessage("Промокод не дійсний");
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
        errorMessage
          ? errorMessage
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
