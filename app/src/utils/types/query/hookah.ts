import { HookahProduct, ProductAttributes } from "./fragments";

export type GetAllHookahProductsResponse = {
  products: {
    data: ProductAttributes[];
  };
};

export type GetAllHookahProductIdsResponse = {
  products: {
    data: {
      id: string;
      attributes: {
        odId: string;
        name: string;
      };
    }[];
  };
};

export type GetHookahProductResponse = {
  product: {
    data: ProductAttributes & {
      attributes: {
        descriptions: string;
        details: string;
        gallery: {
          data: {
            attributes: {
              url: string;
              previewUrl: string;
              alternativeText: string;
            };
          };
        };
        product: HookahProduct;
      };
    };
  };
};
