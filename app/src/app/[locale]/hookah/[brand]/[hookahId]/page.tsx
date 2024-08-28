import { Head } from "@/compoents/molecules";
import { HookahProductPage } from "@/compoents/pages";
import { GET_HOOKAH_PRODUCT_BY_COMPOSITE_ID_QUERY } from "@/query/hookah";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getQuery } from "@/lib/server";
import { getLocale } from "@/utils/helpers";

export default async function HookahProduct({
  params
}: {
  params: { locale: "uk" | "ru"; hookahId: string };
}) {
  const locale = getLocale(params);
  const t = await getTranslations({ locale, namespace: "Breadcrumb" });
  const { loading, error, data } = await getQuery({
    params,
    query: GET_HOOKAH_PRODUCT_BY_COMPOSITE_ID_QUERY,
    variables: {
      compositeId: params.hookahId
    }
  });
  if (error) notFound();

  const product = data.products.data?.at(0).attributes;
  const imageUrl = product.previewImage.data.attributes.url;
  const brandName = product.brand.data.attributes.name;
  const slugBrand = product.brand.data.attributes.slug;
  const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/hookah/${slugBrand}/${product.compositeId}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: imageUrl,
    sku: params.hookahId,
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
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      reviewCount: product.likes
    },
    offersPriceDrop: {
      "@type": "OfferPriceSpecification",
      price: product.price,
      priceCurrency: "UAH"
    }
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
        name: t("hookah"),
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/hookah`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brandName,
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/hookah/${slugBrand}`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: productUrl
      }
    ]
  };

  return (
    <>
      <Head structuredData={jsonLd} breadcrumbsJsonLd={breadcrumbsJsonLd} />
      <HookahProductPage data={data.products.data?.at(0)} loading={loading} />
    </>
  );
}

export async function generateMetadata({
  params
}: {
  params: { locale: "uk" | "ru"; hookahId: string };
}) {
  const locale = getLocale(params);
  const { data } = await getQuery({
    params,
    query: GET_HOOKAH_PRODUCT_BY_COMPOSITE_ID_QUERY,
    variables: {
      compositeId: params.hookahId
    }
  });
  const product = data.products.data?.at(0).attributes;
  const image = product.previewImage.data.attributes.url;
  const slugBrand = product.brand.data.attributes.slug;
  const t = await getTranslations({
    locale,
    namespace: "Hookah.Product.Metadata"
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
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/hookah/${slugBrand}/${product.compositeId}`,
      locale: locale === "uk" ? "uk_UA" : "ru_UA"
    }
  };
}
