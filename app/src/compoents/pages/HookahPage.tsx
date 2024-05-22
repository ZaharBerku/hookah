"use client";

import { Typography } from "@/compoents/atoms";
import { Brands } from "@/compoents/molecules";
import { ProductSection } from "@/compoents/organisms";

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
      category: {
        data: {
          id: "2",
          attributes: {
            name: "hookah"
          }
        }
      },
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
      category: {
        data: {
          id: "2",
          attributes: {
            name: "hookah"
          }
        }
      },
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
      category: {
        data: {
          id: "2",
          attributes: {
            name: "hookah"
          }
        }
      },
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
      category: {
        data: {
          id: "2",
          attributes: {
            name: "hookah"
          }
        }
      },
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
      category: {
        data: {
          id: "2",
          attributes: {
            name: "hookah"
          }
        }
      },
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

const HookahPage = () => {
  return (
    <section className="relative flex flex-col gap-4 w-full">
      <Typography
        className="text-xl text-black font-bold"
        tag="h1"
        text="Кальяни"
      />
      <Brands
        brands={[
          {
            label: "Khmara Cocoloco",
            avatar: "/images/avatar-brand.png",
            id: "1"
          },
          {
            label: "Khmara Cocoloco",
            avatar: "/images/avatar-brand.png",
            id: "2"
          },
          {
            label: "Khmara Cocoloco",
            avatar: "/images/avatar-brand.png",
            id: "3"
          },
          {
            label: "Khmara Cocoloco",
            avatar: "/images/avatar-brand.png",
            id: "4"
          }
        ]}
      />
      <ProductSection data={data} />
    </section>
  );
};

export { HookahPage };
