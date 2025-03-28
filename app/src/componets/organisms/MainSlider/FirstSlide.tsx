"use client";

import Image from "next/image";
import type { FC } from "react";

import { Link } from "@/utils/navigation";

interface IFirstSlideProps {
  isMobile: boolean;
}

const FirstSlide: FC<IFirstSlideProps> = ({ isMobile }) => {
  return (
    <Link href={"/tobacco/unity"} className="relative rounded-lg">
      <Image
        src={isMobile ? "/images/slide-mobile-1.webp" : "/images/slide-1.webp"}
        fill
        priority
        unoptimized
        sizes={
          isMobile
            ? "(max-width: 768px) 100vw, 0vw"
            : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        }
        alt={"slider-pics-1"}
        className="rounded-lg !static"
      />
    </Link>
  );
};

export default FirstSlide;
