import { gql } from "@apollo/client";

import {
  PRODUCT_ATTRIBUTES_FRAGMENT,
  HOOKAH_PRODUCT_FRAGMENT
} from "./fragments";

export const GET_ALL_HOOKAH_PRODUCTS_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  query GetAllHookahProducts($locale: I18NLocaleCode!) {
    products(
      locale: $locale
      filters: { category: { name: { eq: "hookah" } } }
    ) {
      data {
        ...ProductAttributes
      }
    }
  }
`;

export const GET_ALL_HOOKAH_PRODUCT_IDS_QUERY = gql`
  query GetAllHookahProductIds($locale: I18NLocaleCode!) {
    products(filters: { category: { name: { eq: "hookah" } } }) {
      data {
        id
        attributes {
          odId
          name
        }
      }
    }
  }
`;

export const GET_HOOKAH_PRODUCT_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  query GetHookahProduct($locale: I18NLocaleCode!, $id: ID!) {
    product(locale: $locale, id: $id) {
      data {
        ...ProductAttributes
        attributes {
          descriptions
          details
          gallery
          product {
            ... on ComponentProductsHookah {
              hookah {
                data {
                  id
                  attributes {
                    complete
                    diffuser
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_HOOKAH_PRODUCT_BY_COMPOSITE_ID_QUERY = gql`
  ${PRODUCT_ATTRIBUTES_FRAGMENT}
  ${HOOKAH_PRODUCT_FRAGMENT}
  query GetProductByCompositeId(
    $locale: I18NLocaleCode!
    $compositeId: String!
  ) {
    products(locale: $locale, filters: { compositeId: { eq: $compositeId } }) {
      data {
        ...ProductAttributes
        attributes {
          descriptions
          details
          gallery {
            data {
              attributes {
                url
                previewUrl
                alternativeText
              }
            }
          }
          productOdId
          product {
            ...HookahProduct
          }
          additionalInfo {
            ... on ComponentAdditionalColor {
              colors {
                data {
                  attributes {
                    name
                    imageColor {
                      data {
                        attributes {
                          url
                          previewUrl
                          alternativeText
                        }
                      }
                    }
                    color
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_HOOKAHS_BY_PRODUCT_OD_ID_QUERY = gql`
  query GetHookahsByProductOdId($locale: I18NLocaleCode!, $productOdId: Int!) {
    products(locale: $locale, filters: { productOdId: { eq: $productOdId } }) {
      data {
        attributes {
          compositeId
          category {
            data {
              id
              attributes {
                name
              }
            }
          }
          brand {
            data {
              attributes {
                name
                slug
              }
            }
          }
          additionalInfo {
            ... on ComponentAdditionalColor {
              colors {
                data {
                  attributes {
                    name
                    imageColor {
                      data {
                        attributes {
                          previewUrl
                          url
                          alternativeText
                        }
                      }
                    }
                    color
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// {
//   "products": {
//       "__typename": "ProductEntityResponseCollection",
//       "data": [
//           {
//               "__typename": "ProductEntity",
//               "attributes": {
//                   "__typename": "Product",
//                   "compositeId": "188-kal-ya-n-yahya-zl-118-sinij",
//                   "additionalInfo": [
//                       {
//                           "__typename": "ComponentAdditionalColor",
//                           "colors": {
//                               "__typename": "ColorRelationResponseCollection",
//                               "data": [
//                                   {
//                                       "__typename": "ColorEntity",
//                                       "attributes": {
//                                           "__typename": "Color",
//                                           "name": "blue",
//                                           "imageColor": {
//                                               "__typename": "UploadFileEntityResponse",
//                                               "data": null
//                                           },
//                                           "color": "#2f8fff"
//                                       }
//                                   }
//                               ]
//                           }
//                       }
//                   ]
//               }
//           },
//           {
//               "__typename": "ProductEntity",
//               "attributes": {
//                   "__typename": "Product",
//                   "compositeId": "189-kal-ya-n-yahya-zl-118-chervonij",
//                   "additionalInfo": [
//                       {
//                           "__typename": "ComponentAdditionalColor",
//                           "colors": {
//                               "__typename": "ColorRelationResponseCollection",
//                               "data": [
//                                   {
//                                       "__typename": "ColorEntity",
//                                       "attributes": {
//                                           "__typename": "Color",
//                                           "name": "red",
//                                           "imageColor": {
//                                               "__typename": "UploadFileEntityResponse",
//                                               "data": null
//                                           },
//                                           "color": "#fe1a24"
//                                       }
//                                   }
//                               ]
//                           }
//                       }
//                   ]
//               }
//           }
//       ]
//   }
// }
