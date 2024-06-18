import { Slider } from "@/compoents/molecules";
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
      <div className="grid grid-cols-2 md:gap-4 shadow-3xl p-4 w-full max-w-148 shadow-card-shadow-color rounded-3xl">
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
