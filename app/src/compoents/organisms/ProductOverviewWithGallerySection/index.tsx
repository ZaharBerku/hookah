import { Gallery, ProductOverview } from "@/compoents/organisms";
import { FC } from "react";

interface ProductOverviewWithGallerySectionProps {
  data: any;
}

const ProductOverviewWithGallerySection: FC<
  ProductOverviewWithGallerySectionProps
> = ({ data }) => {
  const { attributes, id } = data;
  const { previewImage, gallery } = attributes;
  const images = [previewImage.data, ...gallery.data];
  return (
    <section className="bg-white flex flex-wrap md:flex-nowrap gap-4">
      {Boolean(images.length) && <Gallery images={images} />}
      <ProductOverview data={attributes} id={id} />
    </section>
  );
};

export { ProductOverviewWithGallerySection };
