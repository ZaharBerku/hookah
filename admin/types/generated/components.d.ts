import type { Schema, Attribute } from '@strapi/strapi';

export interface HookahHookah extends Schema.Component {
  collectionName: 'components_hookah_hookahs';
  info: {
    displayName: 'Hookah';
  };
  attributes: {
    shaftDiameter: Attribute.BigInteger & Attribute.DefaultTo<'0'>;
  };
}

export interface TobaccoTobacco extends Schema.Component {
  collectionName: 'components_tobacco_tobaccos';
  info: {
    displayName: 'Tobacco';
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

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'hookah.hookah': HookahHookah;
      'tobacco.tobacco': TobaccoTobacco;
    }
  }
}
