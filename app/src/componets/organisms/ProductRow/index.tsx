"use client";

import { type FC, type RefObject, useCallback, useState } from "react";

import Card from "../Card";

const EAGER_CARDS = 4;

interface ProductRowProps {
  data: any[];
  rowRef: RefObject<HTMLUListElement>;
}

const ProductRow: FC<ProductRowProps> = ({ data, rowRef }) => {
  const [expanded, setExpanded] = useState(data.length <= EAGER_CARDS);
  const expand = useCallback(() => setExpanded(true), []);
  const visible = expanded ? data : data.slice(0, EAGER_CARDS);

  return (
    <ul
      ref={rowRef}
      data-row
      onScroll={expand}
      onPointerDown={expand}
      onFocus={expand}
      className="flex gap-[var(--row-gap)] [--row-gap:16px] md:[--row-gap:20px] overflow-x-auto snap-x snap-mandatory scrollbar-hidden"
    >
      {visible.map((card: any) => (
        <li
          key={card.id}
          className="snap-start shrink-0 flex w-[calc((100%-var(--row-gap))/2)] bp480:w-[calc((100%-2*var(--row-gap))/3)] bp980:w-[calc((100%-3*var(--row-gap))/4)]"
        >
          <Card card={card} />
        </li>
      ))}
      {!expanded && (
        <li
          aria-hidden
          className="shrink-0 w-[calc((100%-var(--row-gap))/2)] bp480:w-[calc((100%-2*var(--row-gap))/3)] bp980:w-[calc((100%-3*var(--row-gap))/4)]"
        />
      )}
    </ul>
  );
};

export { ProductRow };
