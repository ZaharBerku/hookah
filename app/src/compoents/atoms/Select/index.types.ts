import type { ComponentProps, ReactNode } from "react";

import { Classes, OptionsType } from "@/utils/types";

export type SelectProps = ComponentProps<"select"> & {
  options: OptionsType[];
  selectOption: OptionsType | null;
  classes?: Classes & {
    label?: string;
    helperText?: string;
    containerInput?: string;
  };
  label?: string | ReactNode;
  helperText?: string | boolean;
  isRequred?: boolean;
  full?: boolean;
  sideElements?: {
    right?: ReactNode;
    left?: ReactNode;
  };
  placeholder?: string;
  onChangeSelect: (option: OptionsType) => void;
};
