import { Modals } from "@/compoents/molecules";
import { AnalyticSetup } from "@/compoents/organisms/AnalyticSetup";
import { RootFooter, RootMain, RootHeader } from "@/compoents/templates";
import { NextUIProvider } from "@nextui-org/system";
// import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import { ApolloWrapper } from "@/lib/client";
import { getLocale } from "@/utils/helpers";
import { locales } from "@/utils/navigation";

// import { cookiesKeys } from "@/utils/variables";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: ReactNode;
  params: { locale: "uk" | "ru" };
}>) {
  const locale = getLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  unstable_setRequestLocale(locale);
  // const cookieStore = cookies();
  const messages = await getMessages();
  const isCloseBanner = true;
  // cookieStore.get(cookiesKeys.isCloseBanner)?.value === "true";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t("title"),
    description: t("description"),
    url: "https://hookahstore.com.ua/uk",
    logo: "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_b8a1bc1da6.png",
    sameAs: [
      "https://www.instagram.com/hookahstore.ua/?igsh=MW5yNTFjM29hang4dw%3D%3D"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+38 (063) 616-5809",
      contactType: "customer service",
      areaServed: "UA"
    }
  };
  return (
    <html lang={locale}>
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <AnalyticSetup locale={locale} />
      <body className={inter.className}>
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
    alternates: {
      canonical: "https://hookahstore.com.ua",
      languages: {
        uk: "https://hookahstore.com.ua/uk",
        "ru-UA": "https://hookahstore.com.ua/ru"
      }
    },
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

// export const generateStaticParams = () => {
//   return [
//     {
//       locale: "uk"
//     },
//     {
//       locale: "ru"
//     }
//   ];
// };
