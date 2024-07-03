import { Typography } from "@/compoents/atoms";
import Image from "next/image";

import { Link } from "@/utils/navigation";

const ErrorPage = () => {
  return (
    <div className="text-center flex flex-col justify-center items-center">
      <div className="relative w-64 h-72">
        <Image fill src={"/images/oops-grass-avatar.png"} alt="error-image" />
      </div>
      <Typography tag={"h1"}>Упппс... Щось пішло не так.</Typography>
      <Link
        href={"/"}
        className="text-sm text-primary underline-offset-1 underline"
      >
        На головну сторінку
      </Link>
    </div>
  );
};

export { ErrorPage };
