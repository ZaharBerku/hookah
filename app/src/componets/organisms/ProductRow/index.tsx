import type { FC, RefObject } from "react";

import Card from "../Card";

interface ProductRowProps {
  data: any[];
  rowRef: RefObject<HTMLUListElement>;
}

const ProductRow: FC<ProductRowProps> = ({ data, rowRef }) => {
  return (
    <ul
      ref={rowRef}
      data-row
      className="flex gap-[var(--row-gap)] [--row-gap:16px] md:[--row-gap:20px] overflow-x-auto snap-x snap-mandatory scrollbar-hidden"
    >
      {data.map((card: any) => (
        <li
          key={card.id}
          className="snap-start shrink-0 flex w-[calc((100%-var(--row-gap))/2)] bp480:w-[calc((100%-2*var(--row-gap))/3)] bp980:w-[calc((100%-3*var(--row-gap))/4)]"
        >
          <Card card={card} />
        </li>
      ))}
    </ul>
  );
};

export { ProductRow };
