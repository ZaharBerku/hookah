import { BrandAttributes, ProductAttributes } from "./fragments";

export type GetAllProductsResponse = {
  topProducts: {
    data: ProductAttributes[];
  };
  newProducts: {
    data: ProductAttributes[];
  };
  discountProducts: {
    data: ProductAttributes[];
  };
};

export type GetAllProductsByNameResponse = {
  products: {
    data: ProductAttributes[];
  };
};

export type GetAllProductsSitemapResponse = {
  products: {
    data: ProductAttributes[];
  };
};

export type GetProductByNameBrandResponse = {
  products: {
    data: ProductAttributes[];
  };
  brand: {
    data: BrandAttributes[];
  };
};

export type GetCategoryProductsResponse = {
  products: {
    data: ProductAttributes[];
  };
  brand: {
    data: BrandAttributes[];
  };
};

export type SearchProductsResponse = {
  products: {
    data: ProductAttributes[];
  };
};

export type GetProductsResponse = {
  products: {
    data: ProductAttributes[];
    meta: {
      pagination: {
        pageCount: number;
        total: number;
        page: number;
        pageSize: number;
      };
    };
  };
};
