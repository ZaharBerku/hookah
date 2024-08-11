import { SectionName } from "@/compoents/molecules";
import { FC, PropsWithChildren } from "react";

interface WrapperInfoProductProps extends PropsWithChildren {
  label: string;
}

const WrapperInfoProduct: FC<WrapperInfoProductProps> = ({
  label,
  children
}) => {
  return (
    <section className="flex flex-col gap-9 py-2 md:py-10 w-full">
      <SectionName content={label} />
      {children}
    </section>
  );
};

export { WrapperInfoProduct }