"use client";

import { GoogleAnalytics, ClarityAnalytics } from "@/compoents/molecules";

const AnalyticSetup = () => {
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
