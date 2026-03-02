import type { ComponentProps, ReactNode } from "react";

import { Classes } from "@/utils/types";

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
