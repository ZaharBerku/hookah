import { Typography } from "@/compoents/atoms";
import { getTranslations } from "next-intl/server";
import { FC } from "react";

import { getLocale } from "@/utils/helpers";

interface SectionFAQProps {
  nameTranslations: string;
  params: {
    locale: "uk" | "ru";
  };
}

const SectionFAQ: FC<SectionFAQProps> = async ({
  nameTranslations,
  params
}) => {
  const t = await getTranslations({
    locale: getLocale(params),
    namespace: nameTranslations
  });
  return (
    <section className="flex flex-col w-full gap-16 justify-center items-center">
      <Typography tag="h1" className="" text={t("title")} />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {t
          .raw("faq")
          ?.map(
            (
              { title, subtitle }: { title: string; subtitle: string },
              index: number
            ) => {
              return (
                <div className="flex gap-4 flex-col" key={index}>
                  <Typography
                    tag="h2"
                    className="!text-base text-black font-bold"
                  >
                    {title}
                  </Typography>
                  <p className="text-black text-opacity-70 text-sm font-normal">
                    {subtitle}
                  </p>
                </div>
              );
            }
          )}
      </div>
    </section>
  );
};

export { SectionFAQ };
