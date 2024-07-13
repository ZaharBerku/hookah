import { gql } from "@apollo/client";

export const PRODUCT_ATTRIBUTES_FRAGMENT = gql`
  fragment ProductAttributes on ProductEntity {
    id
    attributes {
      likes
      name
      numberOf
      price
      odId
      slug
      compositeId
      discount
      createdAt
      brand {
        data {
          attributes {
            name
            slug
          }
        }
      }
      previewImage {
        data {
          attributes {
            url
          }
        }
      }
      category {
        data {
          id
          attributes {
            name
          }
        }
      }
    }
  }
`;

export const BRAND_ATTRIBUTES_FRAGMENT = gql`
  fragment BrandAttributes on BrandEntity {
    id
    attributes {
      name
      slug
      category {
        data {
          id
          attributes {
            name
          }
        }
      }
      logo {
        data {
          attributes {
            url
          }
        }
      }
    }
  }
`;

export const TOBACCO_PRODUCT_FRAGMENT = gql`
  fragment TobaccoProduct on ComponentProductsTobacco {
    tobacco {
      data {
        id
        attributes {
          tasteChart
          tastes {
            data {
              attributes {
                name
              }
            }
          }
          weights {
            data {
              attributes {
                size
              }
            }
          }
        }
      }
    }
  }
`;

export const HOOKAH_PRODUCT_FRAGMENT = gql`
  fragment HookahProduct on ComponentProductsHookah {
    hookah {
      data {
        id
        attributes {
          diffuser
          name
          diameterOfInner
          backlighting
          height
          connectionType
          material
        }
      }
    }
  }
`;
