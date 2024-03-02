import { Classes } from "@utils/types";
import type { ComponentProps, ReactNode } from "react";

export type TextareaProps = ComponentProps<"textarea"> & {
  classes?: Classes & {
    label?: string;
    helperText?: string;
  };
  label?: string | ReactNode;
  helperText?: string;
  isRequred?: boolean;
  full?: boolean;
};

export type TypeField = "main";
