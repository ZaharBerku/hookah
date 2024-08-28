import Head from "next/head";
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
    <Head>
      <script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {breadcrumbsJsonLd && (
        <script
          id="structured-breadcrumbs"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbsJsonLd)
          }}
        />
      )}
    </Head>
  );
};

export { HeadComponent as Head };
