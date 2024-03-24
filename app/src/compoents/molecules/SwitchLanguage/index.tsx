"use client";

import { Field } from "@/compoents/atoms";
import cx from "clsx";
import { useLocale } from "next-intl";

import { usePathname, locales, useRouter } from "@/utils/navigation";

const SwitchLanguage = () => {
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
          "w-full text-dark whitespace-nowrap text-xs font-normal !text-base uppercase",
        containerInput: "!w-0 !h-0 hidden"
      }}
      className="hidden"
    />
  );
};

export { SwitchLanguage };
