import { Typography } from "@/compoents/atoms";
import { ProductAvailability, Colors, Price } from "@/compoents/molecules";
import { ProductActions } from "@/compoents/organisms";
import { FC } from "react";

interface ProductOverviewProps {
  name: string;
  description: string;
  colors: string[];
  available: boolean;
  id: string;
}

const ProductOverview: FC<ProductOverviewProps> = (props) => {
  const { name, description, colors, available, id } = props;
  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col w-full gap-4 pb-6 border-b border-b-black border-opacity-10">
        <Typography tag="h1" text={name} />
        <ProductAvailability available={available} />
        <p className=" text-3xs text-black text-opacity-60 font-normal">
          {description}
        </p>
        <Colors colors={["#fff", "#000", "red", "green"]} />
      </div>
      <Price price={100} discount={10} />
      <ProductActions id={id} likes={"1"} />
    </div>
  );
};

export { ProductOverview };
