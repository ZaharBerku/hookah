"use client";

import { Color, ColorsSkeleton } from "@/componets/molecules";
import { DocumentNode, useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import { FC } from "react";

import { useStores } from "@/hooks";

interface ColorsProps {
  productOdId: number;
  compositeId: string;
  query: DocumentNode;
}

const Colors: FC<ColorsProps> = ({ productOdId, compositeId, query }) => {
  const { localization } = useStores();
  const t = useTranslations("Color");
  const { data, loading } = useQuery(query, {
    variables: {
      productOdId,
      locale: localization.locale
    }
  });

  if (loading) {
    return <ColorsSkeleton />;
  }

  const currentData = data?.products?.data?.map((item: any) => {
    return {
      category: item.attributes.category.data.attributes.name,
      brand: item.attributes.brand.data.attributes.slug,
      compositeId: item.attributes.compositeId,
      color: item?.attributes?.additionalInfo?.at(0)?.colors?.data?.at(0) || "",
      type: item?.attributes?.type?.data?.attributes?.slugType
    };
  });

  if (!currentData.length || currentData.length === 1) {
    return null;
  }

  return (
    <form>
      <fieldset className="flex gap-4 flex-wrap">
        <legend className={"font-bold text-lg text-black mb-4"}>
          {t("label")}
        </legend>
        {currentData?.map(
          (
            {
              compositeId: currentCompositeId,
              category,
              brand,
              color,
              type
            }: any,
            index: number
          ) => {
            return (
              <Color
                key={index}
                isSelected={currentCompositeId === compositeId}
                href={
                  type
                    ? `/${category}/${type}/${brand}/${currentCompositeId}`
                    : `/${category}/${brand}/${currentCompositeId}`
                }
                color={color?.attributes?.color || ""}
                imageData={color?.attributes?.imageColor?.data?.attributes}
              />
            );
          }
        )}
      </fieldset>
    </form>
  );
};

export { Colors };
