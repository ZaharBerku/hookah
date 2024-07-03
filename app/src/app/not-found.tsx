import { Typography } from "@/compoents/atoms";
import Image from "next/image";

import RootLayout from "@/app/[locale]/layout";

export default function Custom500() {
  return (
    <div className="text-center flex flex-col justify-center items-center">
      <div className="relative w-64 h-72">
        <Image fill src={"/images/oops-grass-avatar.png"} alt="error-image" />
      </div>
      <Typography>Упппс... Щось пішло не так.</Typography>
    </div>
  );
}
