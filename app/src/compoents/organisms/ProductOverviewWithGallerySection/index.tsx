import { Gallery, ProductOverview } from "@/compoents/organisms";
import { DocumentNode } from "@apollo/client";
import { FC } from "react";

interface ProductOverviewWithGallerySectionProps {
  data: any;
  query?: DocumentNode;
}

const ProductOverviewWithGallerySection: FC<
  ProductOverviewWithGallerySectionProps
> = ({ data, query }) => {
  const { attributes, id } = data || {};
  const { previewImage, gallery } = attributes;
  const images = [previewImage.data, ...gallery.data];
  return (
    <section className="bg-white flex items-center md:items-start justify-center md:justify-start flex-wrap md:flex-nowrap gap-4">
      {Boolean(images.length) && <Gallery images={images} />}
      <ProductOverview data={attributes} id={id} query={query} />
    </section>
  );
};

export { ProductOverviewWithGallerySection };
