import { ReactNode, FC, SVGProps } from "react";

export type Classes = {
  wrapper?: string;
  container?: string;
};

export type CheckboxButtonType = {
  id: number;
  title: string;
  value: string;
  name: string;
};

export type AmmoutRadioType = {
  id: number;
  title: string;
  value: number;
  name?: string;
};

export interface FormikActions<Values> {
  setFieldValue<Field extends keyof Values>(
    field: Field,
    value: Values[Field],
    shouldValidate?: boolean
  ): void;
}

export type DropdownOption = {
  id: number;
  value: string | number;
  label: string | ReactNode;
  icon?: FC<SVGProps<SVGElement>>;
};

export type TagsType = {
  id: number;
  text: string;
};

export type FilterListType = {
  id: number;
  title: string;
  value: string;
};

export type ColorsTag =
  | "draft"
  | "active"
  | "completed"
  | "upcoming"
  | "canceled";
