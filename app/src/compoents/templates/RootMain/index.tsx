import { Main, Wrapper } from "@/compoents/atoms";
import { PropsWithChildren, FC } from "react";


interface RootMainProps extends PropsWithChildren {}

const RootMain: FC<RootMainProps> = ({ children }) => {
  return (
    <Main className="w-full flex-1 min-h-full">
      <Wrapper tag="div" className="py-2 md:py-15">
        {children}
      </Wrapper>
    </Main>
  );
};

export { RootMain };
