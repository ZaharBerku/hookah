import clsx from "clsx";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app"
};

export default function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body
        className={clsx(
          inter.className,
          "w-full flex flex-col justify-center items-center"
        )}
      >
        {children}
      </body>
    </html>
  );
}
