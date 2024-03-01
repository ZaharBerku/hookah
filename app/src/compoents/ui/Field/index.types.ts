import { Classes } from "@/utils/types";
import type { ComponentProps, ReactNode } from "react";

export type FieldProps = ComponentProps<"input"> & {
  classes?: Classes & {
    label?: string;
    helperText?: string;
  };
  label?: string | ReactNode;
  helperText?: string | boolean;
  isRequred?: boolean;
  full?: boolean;
};

export type TypeField = "main";
