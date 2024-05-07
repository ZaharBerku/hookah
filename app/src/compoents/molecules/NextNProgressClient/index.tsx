"use client";

import { useSearchParams } from "next/navigation";
import NextNProgress from "nextjs-progressbar";
import NProgress from "nprogress";
import { FC, useEffect } from "react";

import { usePathname } from "@/utils/navigation";

interface NextNProgressClientProps {
  isCloseBanner: boolean;
}

const NextNProgressClient: FC<NextNProgressClientProps> = ({
  isCloseBanner
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.start();
  }, [pathname]);

  useEffect(() => {
    NProgress.done();
  }, [searchParams]);

  return (
    <NextNProgress
      height={5}
      options={{
        easing: "ease",
        speed: 1000,
        showSpinner: false
      }}
      color={isCloseBanner ? "#F57906" : "#000"}
      startPosition={0.3}
      stopDelayMs={200}
      showOnShallow={true}
    />
  );
};

export { NextNProgressClient };
