"use client";

import Script from "next/script";
import { FC } from "react";

interface HeadProps {
  structuredData: any;
}

const Head: FC<HeadProps> = ({ structuredData }) => {
  return (
    <head>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </head>
  );
};

export { Head };
