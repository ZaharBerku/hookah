import { Main, Wrapper } from "@/compoents/atoms";
import { Counter } from "@/compoents/molecules";
import { PropsWithChildren, FC } from "react";

interface RootMainProps extends PropsWithChildren {}

const RootMain: FC<RootMainProps> = ({ children }) => {
  return (
    <Main className=" w-full">
      <Wrapper>
        {children}
        <Counter />
      </Wrapper>
    </Main>
  );
};

export { RootMain };
