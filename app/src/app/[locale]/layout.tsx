import { Modals } from "@/componets/molecules";
import { AgeGate } from "@/componets/organisms/AgeGate";
import { AGE_GATE_INIT_SCRIPT } from "@/componets/organisms/AgeGate/script";
import { AnalyticSetup } from "@/componets/organisms/AnalyticSetup";
import { RootFooter, RootMain, RootHeader } from "@/componets/templates";
import { NextUIProvider } from "@nextui-org/system";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import { ApolloWrapper } from "@/lib/client";
import { getLocale } from "@/utils/helpers";
import { locales } from "@/utils/navigation";

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-inter"
});
// Inter's hryvnia sign on its own, so prices do not pull the whole latin-ext subset.
const hryvnia = localFont({
  src: "../../assets/fonts/inter-hryvnia.woff2",
  weight: "100 900",
  variable: "--font-hryvnia",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+20B4" }]
});

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: ReactNode;
  params: { locale: "uk" | "ru" };
}>) {
  const locale = getLocale(params);
  unstable_setRequestLocale(locale);
  const messages = await getMessages();
  const isCloseBanner = true;

  return (
    <html lang={locale} suppressHydrationWarning>
      <AnalyticSetup locale={locale} />
      <body className={`${inter.variable} ${hryvnia.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: AGE_GATE_INIT_SCRIPT }} />
        <AgeGate locale={locale} />
        <NextTopLoader
          showSpinner={false}
          height={5}
          color={isCloseBanner ? "#F57906" : "#000"}
        />
        <NextIntlClientProvider messages={messages}>
          <ApolloWrapper>
            <NextUIProvider className="w-full flex flex-col relative min-h-[100dvh]">
              <RootHeader isCloseBanner={isCloseBanner} />
              <RootMain>{children}</RootMain>
              <RootFooter params={params} />
              <Modals />
              <Toaster />
            </NextUIProvider>
          </ApolloWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export async function generateMetadata({
  params
}: {
  params: { locale: "uk" | "ru" };
}) {
  const locale = locales.includes(params.locale) ? params.locale : "uk";
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: t("title"),
      images: [
        {
          url: "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_b8a1bc1da6.png",
          type: "image/png",
          width: 200,
          height: 200,
          media: "(max-width: 600px)",
          secureUrl:
            "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_b8a1bc1da6.png"
        },
        {
          url: "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_with_full_name_f0d133e35b.png",
          type: "image/png",
          width: 500,
          height: 300,
          media: "(min-width: 601px)",
          secureUrl:
            "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_with_full_name_f0d133e35b.png"
        }
      ],
      type: "website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}`,
      locale: locale === "uk" ? "uk_UA" : "ru_UA"
    }
  };
}

export const generateStaticParams = () => {
  return [{ locale: "uk" }, { locale: "ru" }];
};
