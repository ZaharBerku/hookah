"use client";

import { type FC, type RefObject, useEffect, useState } from "react";

import Card from "../Card";

interface ProductRowProps {
  data: any[];
  rowRef: RefObject<HTMLUListElement>;
}

const ProductRow: FC<ProductRowProps> = ({ data, rowRef }) => {
  const [requestedImages, setRequestedImages] = useState<Set<string> | null>(
    () => new Set()
  );

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    if (typeof IntersectionObserver === "undefined") {
      setRequestedImages(null);
      return;
    }

    const pendingCards = new Map<Element, string>(
      data.map((card, index) => [row.children[index], card.id])
    );
    let rowIsNearViewport = false;
    const cardObserver = new IntersectionObserver(
      (entries) => {
        if (!rowIsNearViewport) return;

        const requestedIds: string[] = [];
        for (const { isIntersecting, target } of entries) {
          if (!isIntersecting) continue;
          const id = pendingCards.get(target);
          if (id === undefined) continue;
          requestedIds.push(id);
          pendingCards.delete(target);
          cardObserver.unobserve(target);
        }
        if (requestedIds.length) {
          setRequestedImages(
            (current) =>
              new Set([...Array.from(current ?? []), ...requestedIds])
          );
        }
      },
      { root: row, rootMargin: "0px 100%" }
    );
    const rowObserver = new IntersectionObserver(
      (entries) => {
        rowIsNearViewport = entries[entries.length - 1].isIntersecting;
        if (rowIsNearViewport) {
          pendingCards.forEach((_, card) => cardObserver.observe(card));
        } else {
          cardObserver.disconnect();
        }
      },
      { rootMargin: "120px 0px" }
    );

    rowObserver.observe(row);
    return () => {
      rowObserver.disconnect();
      cardObserver.disconnect();
    };
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
          <Card
            card={card}
            showImage={requestedImages?.has(card.id) ?? true}
            imageLoading={requestedImages ? "eager" : undefined}
          />
        </li>
      ))}
    </ul>
  );
};

export { ProductRow };
