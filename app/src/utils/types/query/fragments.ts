import { z } from "zod";

export const ProductAttributesSchema = z.object({
  id: z.string(),
  attributes: z.object({
    likes: z.number(),
    name: z.string(),
    numberOf: z.number(),
    price: z.number(),
    odId: z.string(),
    slug: z.string(),
    compositeId: z.string(),
    discount: z.number(),
    createdAt: z.string(),
    brand: z.object({
      data: z.object({
        attributes: z.object({
          name: z.string(),
          slug: z.string(),
        }),
      }),
    }),
    previewImage: z.object({
      data: z.object({
        attributes: z.object({
          url: z.string(),
          alternativeText: z.string()
        }),
      }),
    }),
    category: z.object({
      data: z.object({
        id: z.string(),
        attributes: z.object({
          name: z.string(),
        }),
      }),
    }),
  }),
});

export const BrandAttributesSchema = z.object({
  id: z.string(),
  attributes: z.object({
    name: z.string(),
    slug: z.string(),
    logo: z.object({
      data: z.object({
        attributes: z.object({
          url: z.string(),
        }),
      }),
    }),
  }),
});

export const TobaccoProductSchema = z.object({
  tobacco: z.object({
    data: z.object({
      id: z.string(),
      attributes: z.object({
        tasteChart: z.string(),
        tastes: z.array(
          z.object({
            attributes: z.object({
              name: z.string(),
            }),
          })
        ),
        weights: z.array(
          z.object({
            attributes: z.object({
              size: z.string(),
            }),
          })
        ),
      }),
    }),
  }),
});

export const OrderAttributesSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
  status: z.string(),
  order: z.string(),
  department: z.string(),
  publishedAt: z.string(),
});

export const HookahProductSchema = z.object({
  hookah: z.object({
    data: z.object({
      id: z.string(),
      attributes: z.object({
        complete: z.boolean(),
        diffuser: z.boolean(),
      }),
    }),
  }),
});

export type ProductAttributes = z.infer<typeof ProductAttributesSchema>;
export type BrandAttributes = z.infer<typeof BrandAttributesSchema>;
export type TobaccoProduct = z.infer<typeof TobaccoProductSchema>;
export type HookahProduct = z.infer<typeof HookahProductSchema>;
export type OrderAttributes = z.infer<typeof OrderAttributesSchema>
