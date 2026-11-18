import type { FC } from "react";

import { Link } from "@/utils/navigation";

interface HeroSlideProps {
  href: string;
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
}

const HeroSlide: FC<HeroSlideProps> = ({
  href,
  desktopSrc,
  mobileSrc,
  alt
}) => {
  return (
    <Link href={href} className="relative rounded-lg">
      <picture>
        <source media="(max-width: 768px)" srcSet={mobileSrc} />
        <img
          src={desktopSrc}
          loading="lazy"
          decoding="async"
          alt={alt}
          className="rounded-lg w-full h-full object-contain"
        />
      </picture>
    </Link>
  );
};

export default HeroSlide;
