import { Main, Wrapper } from "@/compoents/atoms";
import { SectionName } from "@/compoents/molecules";
import { PropsWithChildren, FC } from "react";

interface RootMainProps extends PropsWithChildren {}

const RootMain: FC<RootMainProps> = ({ children }) => {
  return (
    <Main className=" w-full">
      <Wrapper>
        <SectionName name={"test"} content="test" />
      </Wrapper>
    </Main>
  );
};

export { RootMain };
