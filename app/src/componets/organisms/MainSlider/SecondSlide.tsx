import Image from "next/image";

import { Link } from "@/utils/navigation";

const SecondSlide = () => {
  return (
    <Link href={"/tobacco/swipe"} className="relative rounded-lg">
      <Image
        src={"/images/slide-2.png"}
        fill
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        alt={"slider-pics"}
        className="rounded-lg !static object-contain"
      />
    </Link>
  );
};

export default SecondSlide;
