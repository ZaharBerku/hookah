interface ProductPathAttributes {
  category?: { data?: { attributes?: { name?: string } } | null };
  type?: { data?: { attributes?: { slugType?: string } } | null };
  brand?: { data?: { attributes?: { slug?: string } } | null };
  compositeId?: string;
}

type ProductPath =
  | [category: "accessory" | "coal", type: string, brand: string, id: string]
  | [category: "hookah" | "tobacco", brand: string, id: string];

export function getProductPath(
  product?: ProductPathAttributes | null
): ProductPath | undefined {
  const category = product?.category?.data?.attributes?.name;
  const brand = product?.brand?.data?.attributes?.slug;
  const id = product?.compositeId;
  if (!brand || !id) return;

  if (category === "accessory" || category === "coal") {
    const type = product?.type?.data?.attributes?.slugType;
    if (type) return [category, type, brand, id];
  }

  if (category === "hookah" || category === "tobacco") {
    return [category, brand, id];
  }
}
