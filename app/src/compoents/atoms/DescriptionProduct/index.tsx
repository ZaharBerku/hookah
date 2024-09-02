"use client";

import clsx from "clsx";
import { FC } from "react";
import ReactMarkdown from "react-markdown";

interface DescriptionProductProps {
  descriptions?: string;
  descriptionMarkdown?: string;
  className?: string;
}

const DescriptionProduct: FC<DescriptionProductProps> = ({
  descriptions,
  descriptionMarkdown,
  className
}) => {
  if (!descriptions && !descriptionMarkdown) {
    return null;
  }

  return (
    <>
      {descriptionMarkdown ? (
        <ReactMarkdown
          className={clsx(
            "markdown text-3xs text-black text-opacity-60 font-normal",
            className
          )}
        >
          {descriptionMarkdown}
        </ReactMarkdown>
      ) : (
        <p
          className={clsx(
            "text-3xs text-black text-opacity-60 font-normal",
            className
          )}
        >
          {descriptions}
        </p>
      )}
    </>
  );
};

export { DescriptionProduct };
