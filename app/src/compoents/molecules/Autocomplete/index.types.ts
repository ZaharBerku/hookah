import type { ComponentProps, ReactNode } from "react";

import { Classes, OptionsType } from "@/utils/types";

export type AutocompleteProps = ComponentProps<"input"> & {
  options: OptionsType[];
  selectOption?: OptionsType;
  handleOptionClick?: (option: OptionsType) => void;
  id?: string;
  placeholder?: string;
  classes?: Classes & {
    label?: string;
    helperText?: string;
    containerInput?: string;
  };
  label?: string | ReactNode;
  isLoading?: boolean;
  helperText?: string | boolean;
  isRequred?: boolean;
  full?: boolean;
  sideElements?: {
    right?: ReactNode;
    left?: ReactNode;
  };
  currentValue?: string;
  setCurrentValue?: (value: string) => void;
};
