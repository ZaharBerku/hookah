import { Card } from "@/compoents/organisms";
import { FC } from "react";

interface ProductListProps {
  data: any;
}

const ProductList: FC<ProductListProps> = ({ data }) => {
  return (
    <ul className="grid grid-cols-auto-fill-card-mobile md:grid-cols-auto-fill-card gap-4">
      {data.map((card: any) => {
        return (
          <li key={card.id} className="flex items-center justify-center">
            <Card card={card} />
          </li>
        );
      })}
    </ul>
  );
};

export { ProductList };
