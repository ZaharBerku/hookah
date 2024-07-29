import { Filter, StickyFilterBar } from "@/compoents/organisms";
import { FC, PropsWithChildren } from "react";

interface WrapperProductWithFilterProps extends PropsWithChildren {
  category: string;
  fetchFilterProduct: any;
}

const WrapperProductWithFilter: FC<WrapperProductWithFilterProps> = ({
  children,
  category,
  fetchFilterProduct
}) => {
  return (
    <div className="flex flex-col md:flex-row relative">
      <div className="hidden md:block w-full max-w-74">
        <Filter fetchFilterProduct={fetchFilterProduct} category={category} />
      </div>
      <StickyFilterBar
        fetchFilterProduct={fetchFilterProduct}
        category={category}
      />
      <div className="block md:hidden w-full max-w-74"></div>
      {children}
    </div>
  );
};

export { WrapperProductWithFilter };
