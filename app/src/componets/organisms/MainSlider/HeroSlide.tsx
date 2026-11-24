import type { FC } from "react";

import { DESKTOP_MEDIA, MOBILE_MEDIA } from "@/utils/breakpoints";
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
      {priority && (
        <>
          <link
            rel="preload"
            as="image"
            href={mobileSrc}
            media={MOBILE_MEDIA}
            fetchPriority="high"
          />
          <link
            rel="preload"
            as="image"
            href={desktopSrc}
            media={DESKTOP_MEDIA}
            fetchPriority="high"
          />
        </>
      )}
      <picture>
        <source media={MOBILE_MEDIA} srcSet={mobileSrc} />
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
