import { Slider } from "@/compoents/molecules";
import { FC } from "react";

interface RangesTasteProps {
  taste: [any, string][];
}

const labels = {
  sour: "Кислість",
  spicy: "Пряність",
  freshness: "Свіжість",
  sweetness: "Солодкість"
};

const RangesTaste: FC<RangesTasteProps> = ({ taste }) => {
  return (
    <div className="grid grid-cols-2 w-full md:gap-4">
      {taste.map(([name, value], index) => (
        <Slider
          key={index}
          min={0}
          max={10}
          step={1}
          taste={name}
          label={labels[name as "sour" | "spicy" | "freshness" | "sweetness"]}
          initial={value}
        />
      ))}
    </div>
  );
};

export { RangesTaste };
