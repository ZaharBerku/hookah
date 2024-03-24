import Link from "next/link";

const Banner = () => {
  return (
    <div className="py-2.5 bg-primary flex items-center justify-center w-full">
      <span className="flex gap-1">
        <span className="text-white text-sm">
          Акційні товари зі знижкою до 20% тільки до 14.02.
        </span>
        <Link className="text-white text-sm font-bold underline" href={"#"}>
          Поспішити скристатись акцією
        </Link>
      </span>
    </div>
  );
};

export { Banner };
