"use client";

import { GoogleAnalytics, ClarityAnalytics } from "@/componets/molecules";
import { FC, useEffect } from "react";

import { useStores } from "@/hooks";
import { LocalizationType } from "@/utils/types";

interface AnalyticSetupProps {
  locale: LocalizationType;
}

const AnalyticSetup: FC<AnalyticSetupProps> = ({ locale }) => {
  const { localization } = useStores();

  useEffect(() => {
    localization.setLocale(locale as LocalizationType);
  }, [locale]);

  if (process.env.NEXT_PUBLIC_NODE_ENV === "dev") {
    return null;
  }
  return (
    <>
      <GoogleAnalytics />
      <ClarityAnalytics />
    </>
  );
};

export { AnalyticSetup };
