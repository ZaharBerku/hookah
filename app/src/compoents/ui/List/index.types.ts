import type { Classes } from "@utils/types";
import type { HTMLAttributes, PropsWithChildren } from "react";

type ClassesList = Classes & {
  title?: string;
};

export type ListProps = HTMLAttributes<
  HTMLOListElement | HTMLUListElement | HTMLDListElement
> & {
  tag?: "ul" | "ol" | "dl";
  title?: string;
  classes?: ClassesList;
};

export type ItemProps = HTMLAttributes<HTMLLIElement> & {
  tag?: "li" | "dt" | "dd";
  text?: string;
};

export type WrapperWithTitleProps = PropsWithChildren<{
  title: string;
  classes: Omit<ClassesList, "container">;
}>;
