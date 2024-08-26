import { TobaccoProduct, ProductAttributes } from "./fragments";

export type GetAllTobaccoProductsResponse = {
  products: {
    data: ProductAttributes[];
  };
};

export type GetAllTobaccoProductIdsResponse = {
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

export type GetProductByCompositeIdResponse = {
  products: {
    data: (ProductAttributes & {
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
        product: TobaccoProduct;
      };
    })[];
  };
};

export type GetProductByIdResponse = {
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
        product: TobaccoProduct;
      };
    };
  };
};
