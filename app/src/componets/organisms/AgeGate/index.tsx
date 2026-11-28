import { Button } from "@/componets/atoms";
import { getTranslations } from "next-intl/server";

import { AgeGateClientInit } from "./ClientInit";
import {
  AGE_GATE_ID,
  AGE_GATE_NOSCRIPT_STYLE,
  AGE_GATE_SCRIPT
} from "./script";

interface AgeGateProps {
  locale: "uk" | "ru";
}

const AgeGate = async ({ locale }: AgeGateProps) => {
  const t = await getTranslations({ locale, namespace: "AgeGate" });
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: AGE_GATE_SCRIPT }} />
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: AGE_GATE_NOSCRIPT_STYLE }} />
      </noscript>
      <div id={AGE_GATE_ID}>
        <div className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-20 z-[1000]"></div>
        <div className="fixed left-1/2 top-1/2 w-full flex justify-center items-center px-4 -translate-x-1/2 -translate-y-1/2 z-[1001]">
          <div
            className="w-11/12 md:w-full py-6 px-8 md:px-12 md:py-8 relative rounded-3xl bg-white overflow-auto flex flex-col items-center w-full gap-6 max-w-148"
            role="dialog"
            aria-modal="true"
            aria-labelledby="age-gate-title"
          >
            <div className="w-full flex justify-center items-center">
              <div className="w-40 h-40 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/adult.webp"
                  width={160}
                  height={160}
                  loading="lazy"
                  decoding="async"
                  alt="adult"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 items-center justify-center">
              <h3
                id="age-gate-title"
                className="text-black text-lg md:text-xl text-center font-bold"
              >
                {t("title")}
              </h3>
              <p className="text-center">{t("text")}</p>
            </div>
            <div className="flex gap-2.5 w-full">
              <Button data-age-no type="button" full color="second">
                {t("no")}
              </Button>
              <Button data-age-yes type="button" full>
                {t("yes")}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <AgeGateClientInit />
    </>
  );
};

export { AgeGate };
