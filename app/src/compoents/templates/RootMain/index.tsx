import { Main, Wrapper, Icon } from "@/compoents/atoms";
import { Breadcrumb } from "@/compoents/molecules";
import { PropsWithChildren, FC } from "react";


interface RootMainProps extends PropsWithChildren {}

const RootMain: FC<RootMainProps> = ({ children }) => {
  return (
    <Main className="w-full flex-1 min-h-full">
      <Wrapper tag="div" className="py-6 md:py-15">
        <Breadcrumb
          containerClasses={"flex gap-1 items-center mb-6 md:mb-8"}
          homeElement={"Головна сторінка"}
          listClasses={"text-primary-base font-bold hover:text-primary-hover"}
          activeClasses="text-black font-bold"
          separator={
            <Icon
              type="ChevronRightIcon"
              className="stroke-primary-base stroke-3 w-4 h-4"
            />
          }
        />
        {children}
      </Wrapper>
    </Main>
  );
};

export { RootMain };
