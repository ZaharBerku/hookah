"use client";

import { ProductSection, MainSlider } from "@/compoents/organisms";
import { FC } from "react";

const data = [
  {
    __typename: "ProductEntity",
    id: "1",
    attributes: {
      __typename: "Product",
      likes: 10,
      country: "UA",
      name: "КАЛЬЯН GRAMM SOLO",
      numberOf: 10,
      available: true,
      price: 100,
      discount: 10,
      descriptions:
        "Кальян Yahya ZL 119 - это стильный и элегантный аксессуар, созданный известным производителем Yahya, из США. Этот бренд славится своим высоким качеством и вниманием к деталям, что делает его продукцию популярной среди курильщиков по всему миру. Серия ZL отличается высоким качеством материалов и превосходной долговечностью. Эти кальяны изготавливаются с использованием передовых технологий и проверенных материалов, что обеспечивает надежность и стабильность при использовании. Каждая модель серии ZL представляет собой совершенное сочетание стиля, функциональности и прочности, что делает их привлекательным выбором для ценителей кальянной культуры.",
      colors: [
        {
          __typename: "ComponentStyleColors",
          color: ["#fff", "#000"]
        }
      ],
      previewImage: {
        __typename: "UploadFileEntityResponse",
        data: {
          __typename: "UploadFileEntity",
          attributes: {
            __typename: "UploadFile",
            caption: null,
            previewUrl: null
          }
        }
      }
    }
  },
  {
    __typename: "ProductEntity",
    id: "2",
    attributes: {
      __typename: "Product",
      likes: 10,
      country: "UA",
      name: "КАЛЬЯН GRAMM SOLO",
      numberOf: 10,
      available: true,
      price: 100,
      discount: 0,
      descriptions:
        "Кальян Yahya ZL 119 - это стильный и элегантный аксессуар, созданный известным производителем Yahya, из США. Этот бренд славится своим высоким качеством и вниманием к деталям, что делает его продукцию популярной среди курильщиков по всему миру. Серия ZL отличается высоким качеством материалов и превосходной долговечностью. Эти кальяны изготавливаются с использованием передовых технологий и проверенных материалов, что обеспечивает надежность и стабильность при использовании. Каждая модель серии ZL представляет собой совершенное сочетание стиля, функциональности и прочности, что делает их привлекательным выбором для ценителей кальянной культуры.",
      colors: [
        {
          __typename: "ComponentStyleColors",
          color: ["#fff", "#000"]
        }
      ],
      previewImage: {
        __typename: "UploadFileEntityResponse",
        data: {
          __typename: "UploadFileEntity",
          attributes: {
            __typename: "UploadFile",
            caption: null,
            previewUrl: null
          }
        }
      }
    }
  },
  {
    __typename: "ProductEntity",
    id: "3",
    attributes: {
      __typename: "Product",
      likes: 10,
      country: "UA",
      name: "КАЛЬЯН GRAMM SOLO",
      numberOf: 10,
      available: true,
      price: 100,
      discount: 0,
      descriptions:
        "Кальян Yahya ZL 119 - это стильный и элегантный аксессуар, созданный известным производителем Yahya, из США. Этот бренд славится своим высоким качеством и вниманием к деталям, что делает его продукцию популярной среди курильщиков по всему миру. Серия ZL отличается высоким качеством материалов и превосходной долговечностью. Эти кальяны изготавливаются с использованием передовых технологий и проверенных материалов, что обеспечивает надежность и стабильность при использовании. Каждая модель серии ZL представляет собой совершенное сочетание стиля, функциональности и прочности, что делает их привлекательным выбором для ценителей кальянной культуры.",
      colors: [
        {
          __typename: "ComponentStyleColors",
          color: ["#fff", "#000"]
        }
      ],
      previewImage: {
        __typename: "UploadFileEntityResponse",
        data: {
          __typename: "UploadFileEntity",
          attributes: {
            __typename: "UploadFile",
            caption: null,
            previewUrl: null
          }
        }
      }
    }
  },
  {
    __typename: "ProductEntity",
    id: "4",
    attributes: {
      __typename: "Product",
      likes: 10,
      country: "UA",
      name: "КАЛЬЯН GRAMM SOLO",
      numberOf: 10,
      available: true,
      price: 100,
      discount: 10,
      descriptions:
        "Кальян Yahya ZL 119 - это стильный и элегантный аксессуар, созданный известным производителем Yahya, из США. Этот бренд славится своим высоким качеством и вниманием к деталям, что делает его продукцию популярной среди курильщиков по всему миру. Серия ZL отличается высоким качеством материалов и превосходной долговечностью. Эти кальяны изготавливаются с использованием передовых технологий и проверенных материалов, что обеспечивает надежность и стабильность при использовании. Каждая модель серии ZL представляет собой совершенное сочетание стиля, функциональности и прочности, что делает их привлекательным выбором для ценителей кальянной культуры.",
      colors: [
        {
          __typename: "ComponentStyleColors",
          color: ["#fff", "#000"]
        }
      ],
      previewImage: {
        __typename: "UploadFileEntityResponse",
        data: {
          __typename: "UploadFileEntity",
          attributes: {
            __typename: "UploadFile",
            caption: null,
            previewUrl: null
          }
        }
      }
    }
  },
  {
    __typename: "ProductEntity",
    id: "5",
    attributes: {
      __typename: "Product",
      likes: 10,
      country: "UA",
      name: "КАЛЬЯН GRAMM SOLO",
      numberOf: 10,
      available: true,
      price: 100,
      discount: 10,
      descriptions:
        "Кальян Yahya ZL 119 - это стильный и элегантный аксессуар, созданный известным производителем Yahya, из США. Этот бренд славится своим высоким качеством и вниманием к деталям, что делает его продукцию популярной среди курильщиков по всему миру. Серия ZL отличается высоким качеством материалов и превосходной долговечностью. Эти кальяны изготавливаются с использованием передовых технологий и проверенных материалов, что обеспечивает надежность и стабильность при использовании. Каждая модель серии ZL представляет собой совершенное сочетание стиля, функциональности и прочности, что делает их привлекательным выбором для ценителей кальянной культуры.",
      colors: [
        {
          __typename: "ComponentStyleColors",
          color: ["#fff", "#000"]
        }
      ],
      previewImage: {
        __typename: "UploadFileEntityResponse",
        data: {
          __typename: "UploadFileEntity",
          attributes: {
            __typename: "UploadFile",
            caption: null,
            previewUrl: null
          }
        }
      }
    }
  }
];

interface HomePagePorps {
  loading?: boolean;
  data?: any;
}

const HomePage: FC<HomePagePorps> = ({ loading }) => {
  return (
    <div className="flex flex-col gap-12 relative">
      <MainSlider />
      <ProductSection name="Топ товарів" content="Сьогодні" data={data} />
      <ProductSection name="Новини" content="Огляд новини" data={data} />
      <ProductSection name="Акції" content="Акційний  пропозиції" data={data} />
    </div>
  );
};

export { HomePage };
