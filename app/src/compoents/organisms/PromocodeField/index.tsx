import { Button, Field, Icon } from "@/compoents/atoms";
import { CHECK_PROMOCODE } from "@/query/promocode";
import { useLazyQuery } from "@apollo/client";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { ChangeEvent, FC, useState } from "react";

interface PromocodeFieldProps {}

const PromocodeField: FC<PromocodeFieldProps> = () => {
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

  const handleCheckPromocode = async () => {
    const result = await checkPromocode({
      variables: {
        name: value
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
    } else {
      setError(true);
    }
  };

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
            onClick={handleCheckPromocode}
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
