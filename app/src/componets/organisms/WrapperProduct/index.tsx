"use client";

import { useTranslations } from "next-intl";
import { DescriptionProduct } from "@/componets/atoms";
import {
  ProductActionsStickyBar,
  ProductDetailsSection,
  WrapperInfoProduct
} from "@/componets/organisms";
import { FC, PropsWithChildren } from "react";

interface WrapperProductProps extends PropsWithChildren {
  data: any;
  loading?: boolean;
}

const WrapperProduct: FC<WrapperProductProps> = ({ data, children }) => {
  const { attributes, id } = data || {};
  const t = useTranslations('Product')
  return (
    <div className="flex flex-col gap-16">
      {children}
      <div>
        {attributes?.details && (
          <WrapperInfoProduct label={t('details')}>
            <ProductDetailsSection
              name={attributes?.name}
              details={attributes?.details}
            />
          </WrapperInfoProduct>
        )}
        <WrapperInfoProduct label={t('description')}>
          <DescriptionProduct
            descriptions={attributes.descriptions}
            descriptionMarkdown={attributes.descriptionMarkdown}
          />
        </WrapperInfoProduct>
      </div>
      <ProductActionsStickyBar
        id={id}
        odId={attributes.odId}
        likes={attributes.likes}
        data={attributes}
        numberOf={attributes.numberOf}
      />
    </div>
  );
};

export { WrapperProduct };
