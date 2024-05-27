import { Slider } from "@/compoents/molecules";
import { FC } from "react";

type Taste = {
  value: number;
  label: string;
  taste: "sour" | "spicy" | "freshness" | "sweetness";
};

interface RangesTasteProps {
  taste: Taste[];
}

const RangesTaste: FC<RangesTasteProps> = ({ taste }) => {
  return (
    <div className="grid grid-cols-2 w-full md:gap-4">
      {taste.map((item, index) => (
        <Slider
          key={index}
          min={0}
          max={10}
          step={1}
          taste={item.taste}
          label={item.label}
          initial={item.value}
        />
      ))}
    </div>
  );
};

export { RangesTaste };
