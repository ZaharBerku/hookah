import { useTranslations } from "next-intl";

import HeroSlide from "./HeroSlide";

const SecondSlide = () => {
  const t = useTranslations("Home.Main.Hero");
  return (
    <HeroSlide
      href="/tobacco/swipe"
      desktopSrc="/images/slide-2.webp"
      mobileSrc="/images/slide-2-mobile.webp"
      alt={t("swipe")}
    />
  );
};

export default SecondSlide;
