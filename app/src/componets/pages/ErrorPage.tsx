import { Typography } from "@/componets/atoms";
import Image from "next/image";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="text-center flex flex-col justify-center items-center">
      <div className="relative w-64 h-72">
        <Image
          fill
          loading="lazy"
          src={"/images/oops-grass-avatar.png"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt="error-image"
        />
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
