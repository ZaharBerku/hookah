import type { FC } from "react";

import { Link } from "@/utils/navigation";

interface HeroSlideProps {
  href: string;
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  priority?: boolean;
}

const HeroSlide: FC<HeroSlideProps> = ({
  href,
  desktopSrc,
  mobileSrc,
  alt,
  priority = false
}) => {
  return (
    <Link href={href} className="relative rounded-lg">
      <picture>
        <source media="(max-width: 768px)" srcSet={mobileSrc} />
        <img
          src={desktopSrc}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          alt={alt}
          className="rounded-lg w-full h-full object-contain"
        />
      </picture>
    </Link>
  );
};

export default HeroSlide;
