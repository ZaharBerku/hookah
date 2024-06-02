import { Modals } from "@/compoents/molecules";
import { RootFooter, RootMain, RootHeader } from "@/compoents/templates";
import { NextUIProvider } from "@nextui-org/system";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import { ApolloWrapper } from "@/lib/client";
import { locales } from "@/utils/navigation";
import { cookiesKeys } from "@/utils/variables";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: ReactNode;
  params: { locale: string };
}>) {
  const cookieStore = cookies();
  const isCloseBanner =
    cookieStore.get(cookiesKeys.isCloseBanner)?.value === "true";
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextTopLoader
          showSpinner={false}
          height={5}
          color={isCloseBanner ? "#F57906" : "#000"}
        />
        <ApolloWrapper>
          <NextUIProvider className="w-full flex flex-col relative min-h-[100dvh]">
            <RootHeader isCloseBanner={isCloseBanner} />
            <RootMain>{children}</RootMain>
            <RootFooter />
            <Modals />
            <Toaster />
          </NextUIProvider>
        </ApolloWrapper>
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
  const messages = await import(`../../../messages/${locale}.json`);
  return {
    title: messages.default.title,
    description: messages.default.description,
    openGraph: {
      title: messages.default.ogTitle,
      description: messages.default.ogDescription,
      images: [
        {
          url: "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_b8a1bc1da6.png",
          type: "image/png",
          width: 150,
          height: 150,
          secureUrl:
            "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_b8a1bc1da6.png"
        },
        {
          url: "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_with_full_name_f0d133e35b.png",
          type: "image/png",
          width: 500,
          height: 300,
          secureUrl:
            "https://strapi-hookah-images.s3.us-east-1.amazonaws.com/logo_with_full_name_f0d133e35b.png"
        }
      ],
      type: "website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}`,
      locale: locale === "uk" ? "uk_UA" : "ru_RU"
    }
  };
}

export const generateStaticParams = () => {
  return [
    {
      locale: "uk"
    },
    {
      locale: "ru"
    }
  ];
};
