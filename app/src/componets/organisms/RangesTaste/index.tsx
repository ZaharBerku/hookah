import { Slider } from "@/componets/molecules";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface RangesTasteProps {
  taste: [any, string][];
}

const RangesTaste: FC<RangesTasteProps> = ({ taste }) => {
  const t = useTranslations("Taste");
  return (
    <>
      <span className="block h-px bg-black bg-opacity-10"></span>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 md:shadow-3xl md:p-4 w-full max-w-full md:shadow-card-shadow-color rounded-3xl">
        {taste.map(([name, value], index) => (
          <Slider
            key={index}
            min={0}
            max={10}
            step={1}
            taste={name}
            label={t(name as "sour" | "spicy" | "freshness" | "sweetness")}
            initial={value}
          />
        ))}
      </div>
    </>
  );
};

export { RangesTaste };
