import { Main, Wrapper } from "@/compoents/atoms";
import { PropsWithChildren, FC } from "react";

interface RootMainProps extends PropsWithChildren {}

const RootMain: FC<RootMainProps> = ({ children }) => {
  return (
    <Main className="w-full">
      <Wrapper tag="div">{children}</Wrapper>
    </Main>
  );
};

export { RootMain };
