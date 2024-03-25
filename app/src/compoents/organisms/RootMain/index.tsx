import { Main, Wrapper } from "@/compoents/atoms";
import { Liker, Counter } from "@/compoents/molecules";
import { PropsWithChildren, FC } from "react";

interface RootMainProps extends PropsWithChildren {}

const RootMain: FC<RootMainProps> = ({ children }) => {
  return (
    <Main className=" w-full">
      <Wrapper>
        {children}
        <Liker />
        <Counter />
      </Wrapper>
    </Main>
  );
};

export { RootMain };
