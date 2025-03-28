import Image from "next/image";

import { Link } from "@/utils/navigation";

const FirstSlide = () => {
  return (
    <Link href={"/tobacco/unity"} className="relative rounded-lg">
      <Image
        src={"/images/slide-1.webp"}
        fill
        loading="lazy"
        unoptimized
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        alt={"slider-pics-1"}
        className="rounded-lg !hidden md:!block !static object-contain"
      />
      <Image
        src={"/images/slide-mobile-1.webp"}
        fill
        loading="lazy"
        unoptimized
        sizes="(max-width: 768px) 100vw, 0vw"
        alt={"slider-pics-1"}
        className="rounded-lg !block md:!hidden !static object-contain"
      />
    </Link>
  );
};

export default FirstSlide;
