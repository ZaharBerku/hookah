"use client";

import { GoogleAnalytics } from "@/compoents/molecules";
import Hotjar from "@hotjar/browser";
import { useEffect } from "react";

const siteId = 4972725;
const hotjarVersion = 6;

const AnalyticSetup = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      Hotjar.init(siteId, hotjarVersion);
    }
  }, []);
  return <GoogleAnalytics />;
};

export { AnalyticSetup };
