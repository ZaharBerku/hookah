import { Filter } from "@/compoents/organisms";
import { debounce } from "lodash";
import { FC, PropsWithChildren, useCallback } from "react";

interface WrapperProductWithFilterProps extends PropsWithChildren {
  category: string;
  fetchFilterProduct: any;
}

const WrapperProductWithFilter: FC<WrapperProductWithFilterProps> = ({
  children,
  category,
  fetchFilterProduct
}) => {
  const debouncedFetch = useCallback(
    debounce(async (values: any) => {
      await fetchFilterProduct(values);
    }, 700),
    []
  );
  return (
    <div className="flex relative">
      {category === "hookah" && (
        <div className="hidden md:block w-full max-w-74">
          <Filter fetchFilterProduct={debouncedFetch} category={category} />
        </div>
      )}
      {children}
    </div>
  );
};

export { WrapperProductWithFilter };
