import { Typography } from "@/compoents/atoms";
import { ProductAvailability, Colors } from "@/compoents/molecules";
import { FC } from "react";

interface ProductOverviewProps {
  name: string;
  description: string;
  colors: string[];
}

const ProductOverview: FC<ProductOverviewProps> = (props) => {
  const { name, description, colors } = props;
  return (
    <div className="flex flex-col w-full flex-1">
      <Typography tag="h1" text={name} />
      <ProductAvailability />
      <p>{description}</p>
      <Colors colors={["#fff", "#000", "red", "green"]} />
    </div>
  );
};

export { ProductOverview };
