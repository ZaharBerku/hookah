import { Icon } from "@/componets/atoms";
import { useTranslations } from "next-intl";

const DeliveryInfo = () => {
  const t = useTranslations("Delivery");
  return (
    <div className="flex flex-col w-full gap-2 mt-6 select-none">
      <span className={"font-bold text-lg text-black mb-4"}>Доставка</span>
      <ul className="flex flex-col gap-2">
        <li className="flex gap-2">
          <Icon className="w-6 h-6" type={"NovaIcon"} />
          {t("nova-pickup")}
        </li>
        <li className="flex gap-2">
          <Icon className="w-6 h-6" type={"NovaIcon"} />
          {t("nova-courier")}
        </li>
      </ul>
    </div>
  );
};

export { DeliveryInfo };
