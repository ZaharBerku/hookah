"use client";

import Image from "next/image";

export default function NotFound() {
  return (
    <html>
      <body className="text-center flex justify-center items-center">
        <div className="relative w-64 h-72">
          <Image fill src={"/images/avatar-grass.png"} alt="not-found-image" />
        </div>
      </body>
    </html>
  );
}
