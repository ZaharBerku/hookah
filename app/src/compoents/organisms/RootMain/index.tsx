import { Main, Wrapper } from "@/compoents/atoms";
import { PropsWithChildren, FC } from "react";

interface RootMainProps extends PropsWithChildren {}

const RootMain: FC<RootMainProps> = ({ children }) => {
  return (
    <Main className="bg-black w-full h-20">
      <Wrapper className="max-w-screen-xl m-auto">{children}</Wrapper>
    </Main>
  );
};

export { RootMain };
