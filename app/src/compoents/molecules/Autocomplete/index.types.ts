import { AutocompleteProps as AutocompleteComponentProps } from "@nextui-org/autocomplete";
import type { ReactNode } from "react";

import { Classes } from "@/utils/types";

export type AutocompleteProps = Omit<AutocompleteComponentProps, "children"> & {
  options: any;
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
};
