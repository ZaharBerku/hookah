import type { ReactNode } from "react";
import { PatternFormatProps } from "react-number-format";

import { Classes } from "@/utils/types";

export type FieldFormatProps = PatternFormatProps & {
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

export type TypeField = "main";
