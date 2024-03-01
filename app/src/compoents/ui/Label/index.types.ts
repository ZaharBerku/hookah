import { ComponentProps } from "react";

export type LabelProps = ComponentProps<"label"> & {
  isRequred?: boolean;
};
