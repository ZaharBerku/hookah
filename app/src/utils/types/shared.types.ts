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
};

export type DetailType = {
  key: string;
  value: string | number;
};

export type CategoryType = Category | null;

export type LocalizationType = "uk" | "ru";

