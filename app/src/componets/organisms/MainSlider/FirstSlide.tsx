import { useTranslations } from "next-intl";

import HeroSlide from "./HeroSlide";

const FirstSlide = () => {
  const t = useTranslations("Home.Main.Hero");
  return (
    <HeroSlide
      href="/tobacco/unity"
      desktopSrc="/images/slide-1.webp"
      mobileSrc="/images/slide-mobile-1.webp"
      alt={t("unityLebiga")}
      priority
    />
  );
};

export default FirstSlide;
