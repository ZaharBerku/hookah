import { BrandAttributes } from "./fragments";

export type GetBrandBySlugResponse = {
  brands: {
    data: BrandAttributes[];
  };
};

export type GetAllBrandsResponse = {
  brands: {
    data: BrandAttributes[];
  };
};
