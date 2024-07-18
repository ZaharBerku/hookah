"use client";

import { Color, ColorsSkeleton } from "@/compoents/molecules";
import { GET_HOOKAHS_BY_PRODUCT_OD_ID_QUERY } from "@/query/hookah";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import { FC } from "react";

import { useStores } from "@/hooks";

interface ColorsProps {
  productOdId: number;
  compositeId: string;
}

const Colors: FC<ColorsProps> = ({ productOdId, compositeId }) => {
  const { localization } = useStores();
  const t = useTranslations("Color");
  const { data, loading } = useQuery(GET_HOOKAHS_BY_PRODUCT_OD_ID_QUERY, {
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
      color: item.attributes.additionalInfo.at(0).colors.data.at(0)
    };
  });

  return (
    <form>
      <fieldset className="flex gap-4 flex-wrap">
        <legend className={"font-bold text-lg text-black mb-4"}>
          {t("label")}
        </legend>
        {currentData?.map(
          (
            { compositeId: currentCompositeId, category, brand, color }: any,
            index: number
          ) => {
            return (
              <Color
                key={index}
                isSelected={currentCompositeId === compositeId}
                href={`/${category}/${brand}/${currentCompositeId}`}
                color={color.attributes.color}
              />
            );
          }
        )}
      </fieldset>
    </form>
  );
};

export { Colors };
