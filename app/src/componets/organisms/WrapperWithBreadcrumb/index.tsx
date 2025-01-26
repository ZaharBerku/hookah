import { Breadcrumb } from "@/componets/molecules";
import { FC, PropsWithChildren } from "react";

interface WrapperWithBreadcrumbProps extends PropsWithChildren {
  getDefaultTextGenerator?: (subpath: string, href: string) => string;
}

const WrapperWithBreadcrumb: FC<WrapperWithBreadcrumbProps> = ({
  children,
  getDefaultTextGenerator
}) => {
  return (
    <>
      <Breadcrumb getDefaultTextGenerator={getDefaultTextGenerator} />
      {children}
    </>
  );
};

export { WrapperWithBreadcrumb };
