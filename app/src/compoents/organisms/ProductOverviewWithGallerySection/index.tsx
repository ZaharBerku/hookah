import { Gallery, ProductOverview } from "@/compoents/organisms";

const ProductOverviewWithGallerySection = () => {
  return (
    <section className="bg-white flex flex-wrap md:flex-row gap-4">
      <Gallery
        images={[
          {
            src: "/images/avatar.png",
            alt: "test1"
          },
          {
            src: "/images/avatar.png",
            alt: "test1"
          },
          {
            src: "/images/avatar.png",
            alt: "test1"
          },
          {
            src: "/images/avatar.png",
            alt: "test1"
          },
          {
            src: "/images/avatar.png",
            alt: "test1"
          },
          {
            src: "/images/avatar.png",
            alt: "test1"
          },
          {
            src: "/images/avatar.png",
            alt: "test1"
          }
        ]}
      />
      <ProductOverview
        name={"КАЛЬЯН GRAMM SOLO"}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum mollis nunc a molestie dictum. Mauris venenatis, felis scelerisque aliquet lacinia, nulla nisi venenatis odio, id blandit mauris ipsum id sapien. Vestibulum malesuada orci sit amet pretium facilisis. In lobortis congue augue, a commodo libero tincidunt scelerisque. Donec tempus congue lacinia."
        colors={[]}
        available={false}
        id={"1"}
      />
    </section>
  );
};

export { ProductOverviewWithGallerySection };
