import { useEffect, useState } from "react";

import type { TFormatsObject, TFormatType, FormatVariant } from "@/utils/types";

export const useGetResponseFormats = (formats: TFormatsObject) => {
  const [currentFormat, setCurrentFormat] = useState<
    | {
        [formatType in TFormatType]: FormatVariant;
      }
    | null
  >(null);

  useEffect(() => {
    const updateImageSrc = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCurrentFormat(formats.thumbnail);
      } else {
        setCurrentFormat(formats.small);
      }
    };

    updateImageSrc();
    window.addEventListener("resize", updateImageSrc);

    return () => {
      window.removeEventListener("resize", updateImageSrc);
    };
  }, [formats]);

  return currentFormat;
};
