import Image from "next/image";

import { Link } from "@/utils/navigation";

const FirstSlide = () => {
  return (
    <Link href={"/tobacco/unity"} className="relative rounded-lg">
      <Image
        src={"/images/slide-1.jpg"}
        fill
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        alt={"slider-pics"}
        className="rounded-lg !static object-contain"
      />
    </Link>
  );
};

export default FirstSlide;
