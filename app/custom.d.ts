declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module "*.svg?url" {
  import type { StaticImageData } from "next/image";
  const image: StaticImageData;
  export default image;
}
