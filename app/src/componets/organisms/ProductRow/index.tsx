"use client";

import { type FC, type RefObject, useEffect, useState } from "react";

import Card from "../Card";

interface ProductRowProps {
  data: any[];
  rowRef: RefObject<HTMLUListElement>;
}

const ProductRow: FC<ProductRowProps> = ({ data, rowRef }) => {
  const [visibleImages, setVisibleImages] = useState(() => new Set<string>());

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisibleImages(new Set(data.map((card) => card.id)));
      return;
    }

    const cards = new Map<Element, string>(
      data.map((card, index) => [row.children[index], card.id])
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleIds: string[] = [];
        for (const { isIntersecting, target } of entries) {
          if (!isIntersecting) continue;
          const id = cards.get(target);
          if (id === undefined) continue;
          visibleIds.push(id);
          observer.unobserve(target);
        }
        if (visibleIds.length) {
          setVisibleImages(
            (current) => new Set([...Array.from(current), ...visibleIds])
          );
        }
      },
      { rootMargin: "120px 0px" }
    );

    cards.forEach((_, element) => observer.observe(element));
    return () => observer.disconnect();
  }, [data, rowRef]);

  return (
    <ul
      ref={rowRef}
      data-row
      className="flex gap-[var(--row-gap)] [--row-gap:16px] md:[--row-gap:20px] overflow-x-auto snap-x snap-mandatory scrollbar-hidden"
    >
      {data.map((card) => (
        <li
          key={card.id}
          className="snap-start shrink-0 flex w-[calc((100%-var(--row-gap))/2)] bp480:w-[calc((100%-2*var(--row-gap))/3)] bp980:w-[calc((100%-3*var(--row-gap))/4)]"
        >
          <Card card={card} showImage={visibleImages.has(card.id)} />
        </li>
      ))}
    </ul>
  );
};

export { ProductRow };
