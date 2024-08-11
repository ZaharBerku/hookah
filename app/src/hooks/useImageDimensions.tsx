import { useEffect, useState } from "react";

export const useImageDimensions = ({ url }: { url: string }) => {
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const image = new window.Image();
    image.src = url;
    image.onload = function () {
      const imgElement = this as HTMLImageElement;
      setImageDimensions({
        width: imgElement.width,
        height: imgElement.height
      });
    };
  }, [url]);

  return imageDimensions;
};
