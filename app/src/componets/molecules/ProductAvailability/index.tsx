"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface ProductAvailabilityProps {
  available: boolean;
}

const ProductAvailability: FC<ProductAvailabilityProps> = ({ available }) => {
  const t = useTranslations("Availability");
  return (
    <span
      className={clsx(
        "text-sm font-normal before:block before:min-h-full before:w-px flex gap-4",
        available
          ? "text-primary-green before:bg-primary-green"
          : "text-accent-content before:bg-accent-content "
      )}
    >
      {available ? t("isHave") : t("isNotHave")}
    </span>
  );
};

export { ProductAvailability };
