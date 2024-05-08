import type { ComponentProps, ReactNode } from "react";

import { Classes } from "@/utils/types";

export type SelectProps = ComponentProps<"select"> & {
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
  placeholder?: string;
};
