import { createComponent } from "@/utils/helpers";
import clsx from "clsx";
import type { FC } from "react";

import type {
  ListProps,
  ItemProps,
  WrapperWithTitleProps,
} from "./index.types";

const Component = createComponent<HTMLElement>();

const WrapperWithTitle: FC<WrapperWithTitleProps> = ({
  children,
  title,
  classes,
}) => {
  return (
    <figure className={classes?.wrapper}>
      <figcaption className={classes?.title}>{title}</figcaption>
      {children}
    </figure>
  );
};

const ListComponent: FC<ListProps> = ({
  tag = "ul",
  title,
  classes = {},
  className,
  ...props
}) => {
  const { container, ...classNames } = classes;
  return title ? (
    <WrapperWithTitle classes={classNames} title={title}>
      <Component tag={tag} className={clsx(className, container)} {...props} />
    </WrapperWithTitle>
  ) : (
    <Component tag={tag} className={className} {...props} />
  );
};

const Item: FC<ItemProps> = ({ tag = "li", text, ...props }) => {
  return <Component tag={tag} insideContent={text} {...props} />;
};

ListComponent.displayName = "List";
Item.displayName = "List.Item";

export const List = Object.assign(ListComponent, {
  Item,
});
