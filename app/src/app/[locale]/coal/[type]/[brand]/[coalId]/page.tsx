import { Head } from "@/componets/molecules";
import { TobaccoProductPage } from "@/componets/pages";
import { GET_TOBACCO_PRODUCT_BY_COMPOSITE_ID_QUERY } from "@/query/tobacco";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";
import { getLocale } from "@/utils/helpers";
import { replaceS3WithCDN } from "@/utils/helpers/replaceS3WithCDN";

export default async function CoalProduct({
  params
}: {
  params: { locale: "uk" | "ru"; coalId: string; type: string };
}) {
  const locale = getLocale(params);
  const t = await getTranslations({ locale, namespace: "Breadcrumb" });
  const tMetadata = await getTranslations({
    locale,
    namespace: "Coal.Product.Metadata"
  });
  const { loading, error, data } = await getQuery({
    params,
    query: GET_TOBACCO_PRODUCT_BY_COMPOSITE_ID_QUERY,
    variables: {
      compositeId: params.coalId
    }
  });

  if (error) notFound();

  const product = data.products.data?.at(0).attributes;
  const imageUrl = replaceS3WithCDN(product.previewImage.data.attributes.url);
  const brandName = product.brand.data.attributes.name;
  const slugBrand = product.brand.data.attributes.slug;
  const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/coal/${params.type}/${slugBrand}/${product.compositeId}`;
  const additionalInfo = product?.details?.map(({ key, value }: any) => ({
    "@type": "PropertyValue",
    name: key,
    value: value
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tMetadata("title", { name: product.name }),
    description: tMetadata("description", { name: product.name }),
    image: imageUrl,
    sku: params.coalId,
    brand: {
      "@type": "Brand",
      name: brandName
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "UAH",
      price: product.price,
      availability: product.numberOf
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: productUrl,
      priceValidUntil: "2025-12-31",
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/Refund"
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: product.price || "0.00",
          currency: "UAH"
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "UA"
        }
      },
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        value: product.numberOf || 1
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          value: 1,
          unitCode: "Day"
        },
        transitTime: {
          "@type": "QuantitativeValue",
          value: 1,
          unitCode: "Day"
        }
      }
    },
    additionalProperty: additionalInfo
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Головна",
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("coal"),
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/coal`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t(params.type),
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/cola/${params.type}`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: brandName,
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/cola/${params.type}/${slugBrand}`
      },
      {
        "@type": "ListItem",
        position: 5,
        name: product.name,
        item: productUrl
      }
    ]
  };

  return (
    <>
      <Head structuredData={jsonLd} breadcrumbsJsonLd={breadcrumbsJsonLd} />
      <TobaccoProductPage loading={loading} data={data.products.data?.at(0)} />
    </>
  );
}

export async function generateMetadata({
  params
}: {
  params: { locale: "uk" | "ru"; coalId: string; brand: string; type: string };
}) {
  const locale = getLocale(params);
  const { data } = await getQuery({
    params,
    query: GET_TOBACCO_PRODUCT_BY_COMPOSITE_ID_QUERY,
    variables: {
      compositeId: params.coalId
    }
  });
  const product = data.products.data?.at(0).attributes;
  const image = replaceS3WithCDN(product.previewImage.data.attributes.url);
  const slugBrand = product.brand.data.attributes.slug;
  const t = await getTranslations({
    locale,
    namespace: "Coal.Product.Metadata"
  });
  return {
    title: t("title", { name: product.name }),
    description: t("description", { name: product.name }),
    openGraph: {
      title: t("title", { name: product.name }),
      description: t("description", { name: product.name }),
      siteName: t("title", { name: product.name }),
      images: [
        {
          url: image,
          type: "image/png",
          width: 200,
          height: 200,
          secureUrl: image
        }
      ],
      type: "website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/coal/${params.type}/${slugBrand}/${product.compositeId}`,
      locale: locale === "uk" ? "uk_UA" : "ru_UA"
    }
  };
}
