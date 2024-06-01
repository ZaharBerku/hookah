import { Modals } from "@/compoents/molecules";
import { RootFooter, RootMain, RootHeader } from "@/compoents/templates";
import { NextUIProvider } from "@nextui-org/system";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import { ApolloWrapper } from "@/lib/client";
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
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
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
  params: { locale: string };
}) {
  const locale = params.locale || "uk";
  const messages = await import(`../../../messages/${locale}.json`);
  return {
    metadataBase: process.env.NEXT_PUBLIC_BASE_URL,
    title: messages.default.title,
    description: messages.default.description,
    openGraph: {
      title: messages.default.ogTitle,
      description: messages.default.ogDescription,
      images: [{ url: "/icons/logo.svg" }]
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
