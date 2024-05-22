"use client";

import { Gallery } from "@/compoents/organisms";

const HookahProductPage = () => {
  return (
    <section className="relative flex flex-col gap-4 w-full h-full">
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
    </section>
  );
};

export { HookahProductPage };
