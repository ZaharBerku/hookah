"use client";

import { Field } from "@/compoents/atoms";
import cx from "clsx";
import { useLocale } from "next-intl";
import { FC } from "react";

import { usePathname, locales, useRouter } from "@/utils/navigation";

interface SwitchLanguageProps {
  className?: string;
}

const SwitchLanguage: FC<SwitchLanguageProps> = ({ className }) => {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocation = useLocale();
  const handleChangeLanguage = (lang: "uk" | "ru") => {
    router.replace(pathname, { locale: lang });
  };
  return (
    <Field
      type="checkbox"
      label={
        <span className="flex cursor-pointer">
          {locales.map((local, index) => {
            return (
              <span
                onClick={() => handleChangeLanguage(local)}
                key={index}
                className={cx("px-1.5 border-r border-dark last:border-none", {
                  "text-primary": currentLocation === local
                })}
              >
                {local}
              </span>
            );
          })}
        </span>
      }
      classes={{
        label:
          "w-full text-dark whitespace-nowrap font-normal text-base uppercase",
        containerInput: "!w-0 !h-0 hidden",
        wrapper: className
      }}
      className="hidden"
    />
  );
};

export { SwitchLanguage };
