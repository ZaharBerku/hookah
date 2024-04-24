import type { Schema, Attribute } from '@strapi/strapi';

export interface ProductsCoal extends Schema.Component {
  collectionName: 'components_products_coals';
  info: {
    displayName: 'coal';
  };
  attributes: {
    weight: Attribute.BigInteger &
      Attribute.SetMinMax<
        {
          min: '0';
        },
        string
      > &
      Attribute.DefaultTo<'0'>;
  };
}

export interface ProductsHookah extends Schema.Component {
  collectionName: 'components_products_hookahs';
  info: {
    displayName: 'Hookah';
  };
  attributes: {
    details: Attribute.JSON;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'products.coal': ProductsCoal;
      'products.hookah': ProductsHookah;
    }
  }
}
