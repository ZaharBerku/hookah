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
      className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hidden"
    >
      {data.map((card: any) => (
        <li
          key={card.id}
          className="snap-start shrink-0 flex w-[calc(50%-8px)] bp480:w-[calc(33.333%-11px)] bp980:w-[calc(25%-15px)]"
        >
          <Card card={card} />
        </li>
      ))}
    </ul>
  );
};

export { ProductRow };
