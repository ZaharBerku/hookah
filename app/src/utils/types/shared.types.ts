import { Category } from "./enum";

export type Classes = {
  wrapper?: string;
  container?: string;
};

export type NavListType = {
  name: string;
  link: string;
  list?: NavListType[];
};

export type OptionsType = {
  label: string;
  value: string;
  image?: string;
  alt?: string;
  price?: number;
  discount?: number;
};

export type DetailType = {
  key: string;
  value: string | number;
};

export type CategoryType = Category | null;

export type LocalizationType = "uk" | "ru";

export type TFormats = "small" | "medium" | "thumbnail"
export type TFormatType = "origin" | "webp" | "avif";

export interface FormatVariant {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number | null;
  height: number | null;
}

export type TFormatsObject = {
  [format in TFormats]: {
    [formatType in TFormatType]: FormatVariant;
  };
};