import Script from "next/script";
import { FC } from "react";

interface HeadProps {
  structuredData: any;
  breadcrumbsJsonLd?: any;
}

const HeadComponent: FC<HeadProps> = ({
  structuredData,
  breadcrumbsJsonLd
}) => {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {breadcrumbsJsonLd && (
        <Script
          id="structured-breadcrumbs"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbsJsonLd)
          }}
        />
      )}
    </>
  );
};

export { HeadComponent as Head };
