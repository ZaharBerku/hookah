import { Head } from "@/componets/molecules";
import { TobaccoProductPage } from "@/componets/pages";
import { GET_TOBACCO_PRODUCT_BY_COMPOSITE_ID_QUERY } from "@/query/tobacco";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";
import { getLocale } from "@/utils/helpers";
import { replaceS3WithCDN } from "@/utils/helpers/replaceS3WithCDN";
import { buildAlternates } from "@/utils/seo/alternates";
import { getProductPath } from "@/utils/seo/productPath";

type ProductParams = { locale: "uk" | "ru"; coalId: string };

async function getCoalProduct(params: ProductParams) {
  const { loading, error, data } = await getQuery({
    params,
    query: GET_TOBACCO_PRODUCT_BY_COMPOSITE_ID_QUERY,
    variables: {
      compositeId: params.coalId
    }
  });

  const entry = data?.products?.data?.at(0);
  const path = getProductPath(entry?.attributes);
  if (error || path?.[0] !== "coal") notFound();

  return { entry, loading, path };
}

export default async function CoalProduct({
  params
}: {
  params: ProductParams;
}) {
  const { entry, loading, path } = await getCoalProduct(params);
  const locale = getLocale(params);
  const t = await getTranslations({ locale, namespace: "Breadcrumb" });
  const tMetadata = await getTranslations({
    locale,
    namespace: "Coal.Product.Metadata"
  });
  const product = entry.attributes;
  const imageUrl = replaceS3WithCDN(product.previewImage.data.attributes.url);
  const brandName = product.brand.data.attributes.name;
  const [category, type, brand, id] = path;
  const homeUrl = buildAlternates(locale, "").canonical;
  const categoryUrl = `${homeUrl}/${category}`;
  const typeUrl = `${categoryUrl}/${type}`;
  const brandUrl = `${typeUrl}/${brand}`;
  const productUrl = `${brandUrl}/${id}`;
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
    sku: id,
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
        name: t("home"),
        item: homeUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("coal"),
        item: categoryUrl
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t(type),
        item: typeUrl
      },
      {
        "@type": "ListItem",
        position: 4,
        name: brandName,
        item: brandUrl
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
      <TobaccoProductPage loading={loading} data={entry} />
    </>
  );
}

export async function generateMetadata({ params }: { params: ProductParams }) {
  const locale = getLocale(params);
  const { entry, path } = await getCoalProduct(params);
  const product = entry.attributes;
  const image = replaceS3WithCDN(product.previewImage.data.attributes.url);
  const alternates = buildAlternates(locale, path.join("/"));
  const t = await getTranslations({
    locale,
    namespace: "Coal.Product.Metadata"
  });
  return {
    title: t("title", { name: product.name }),
    description: t("description", { name: product.name }),
    alternates,
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
      url: alternates.canonical,
      locale: locale === "uk" ? "uk_UA" : "ru_UA"
    }
  };
}
