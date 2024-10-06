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
      descriptionMarkdown
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
            alternativeText
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
      type {
        data {
          attributes {
            slugType
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
      categories {
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

// export const ACCESSORY_PRODUCT_FRAGMENT = gql`
//   fragment AccessoryProduct on ComponentProductsAccessory {
//     accessory {
//       data {
//         id
//         attributes {
//           accessoryType
//         }
//       }
//     }
//   }
// `;

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
