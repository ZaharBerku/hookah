import { Main, Wrapper } from "@/compoents/atoms";
import { ProductSection } from "@/compoents/organisms";

const data = [
  {
    id: 0,
    image: {
      src: "/images/avatar.png",
      alt: "avatar"
    },
    name: "Щипці Blade (Хамелеон)",
    likes: 10,
    price: 100,
    discount: 10
  },
  {
    id: 1,
    image: {
      src: "/images/avatar.png",
      alt: "avatar"
    },
    name: "Щипці Blade (Хамелеон)",
    likes: 10,
    price: 100,
    discount: 10
  },
  {
    id: 2,
    image: {
      src: "/images/avatar.png",
      alt: "avatar"
    },
    name: "Щипці Blade (Хамелеон)",
    likes: 10,
    price: 100,
    discount: 10
  },
  {
    id: 3,
    image: {
      src: "/images/avatar.png",
      alt: "avatar"
    },
    name: "Щипці Blade (Хамелеон)",
    likes: 10,
    price: 100,
    discount: 10
  },
  {
    id: 4,
    image: {
      src: "/images/avatar.png",
      alt: "avatar"
    },
    name: "Щипці Blade (Хамелеон)",
    likes: 10,
    price: 100,
    discount: 10
  },
  {
    id: 5,
    image: {
      src: "/images/avatar.png",
      alt: "avatar"
    },
    name: "Щипці Blade (Хамелеон)",
    likes: 10,
    price: 100,
    discount: 10
  },
  {
    id: 6,
    image: {
      src: "/images/avatar.png",
      alt: "avatar"
    },
    name: "Щипці Blade (Хамелеон)",
    likes: 10,
    price: 100,
    discount: 10
  },
  {
    id: 7,
    image: {
      src: "/images/avatar.png",
      alt: "avatar"
    },
    name: "Щипці Blade (Хамелеон)",
    likes: 10,
    price: 100,
    discount: 10
  },
  {
    id: 8,
    image: {
      src: "/images/avatar.png",
      alt: "avatar"
    },
    name: "Щипці Blade (Хамелеон)",
    likes: 10,
    price: 100,
    discount: 10
  },
  {
    id: 9,
    image: {
      src: "/images/avatar.png",
      alt: "avatar"
    },
    name: "Щипці Blade (Хамелеон)",
    likes: 10,
    price: 100,
    discount: 10
  }
];

const RootMain = () => {
  return (
    <Main className="w-full">
      <Wrapper className="flex flex-col gap-12 py-15 relative">
        <ProductSection name="Топ товарів" content="Сьогодні" data={data} />
        <ProductSection name="Новини" content="Огляд новини" data={data} />
        <ProductSection
          name="Акції"
          content="Акційний  пропозиції"
          data={data}
        />
      </Wrapper>
    </Main>
  );
};

export { RootMain };
