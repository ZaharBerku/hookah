import Hotjar from "@hotjar/browser";
import { GoogleAnalytics } from "nextjs-google-analytics";
import React, { useEffect } from "react";

const siteId = 3901471;

const hotjarVersion = 6;

const AnalyticsSetup = () => {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === "prod") {
      Hotjar.init(siteId, hotjarVersion);
    }
  }, []);

  if (process.env.NEXT_PUBLIC_NODE_ENV !== "prod") {
    return null;
  }

  return (
    <>
      <GoogleAnalytics trackPageViews />
    </>
  );
};

export { AnalyticsSetup };
