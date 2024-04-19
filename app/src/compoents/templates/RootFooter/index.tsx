import { Footer, Wrapper, Button } from "@/compoents/atoms";
import { Logo, SocialButton } from "@/compoents/molecules";

const RootFooter = () => {
  return (
    <Footer className="w-full bg-black">
      <Wrapper className="py-6 md:py-10">
        <div className="flex flex-col gap-4">
          <Logo />
          <Button
            color="transparent"
            as={"link"}
            className="text-white text-sm font-normal !h-4"
            href={"tel:+ 38 (067) 564-4474"}
          >
            + 38 (067) 564-4474
          </Button>
          <Button
            color="transparent"
            as={"link"}
            className="text-white text-sm font-normal !h-4"
            href={"mailto:ibrahim.farouq@gmail.com"}
          >
            ibrahim.farouq@gmail.com
          </Button>
          <div className="flex gap-3 mt-4">
            <SocialButton href={'#'} />
            <SocialButton href={'#'} />
          </div>
        </div>
      </Wrapper>
    </Footer>
  );
};

export { RootFooter };
