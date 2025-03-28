"use client";

import Image from "next/image";

import { useMediaQuery } from "@/hooks";
import { Link } from "@/utils/navigation";

const FirstSlide = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <Link href={"/tobacco/unity"} className="relative rounded-lg">
      {isMobile ? (
        <Image
          src={"/images/slide-mobile-1.webp"}
          fill
          priority
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={"slider-pics-1"}
          className="rounded-lg !static object-contain"
        />
      ) : (
        <Image
          src={"/images/slide-1.webp"}
          fill
          priority
          unoptimized
          sizes="(max-width: 768px) 100vw, 0vw"
          alt={"slider-pics-1"}
          className="rounded-lg !static object-contain"
        />
      )}
    </Link>
  );
};

export default FirstSlide;
