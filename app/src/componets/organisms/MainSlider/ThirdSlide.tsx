import { useTranslations } from "next-intl";

import HeroSlide from "./HeroSlide";

const ThirdSlide = () => {
  const t = useTranslations("Home.Main.Hero");
  return (
    <HeroSlide
      href="/tobacco/unity"
      desktopSrc="/images/slide-3.webp"
      mobileSrc="/images/slide-3-mobile.webp"
      alt={t("unityNewFlavors")}
    />
  );
};

export default ThirdSlide;
