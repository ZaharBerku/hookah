import { Footer, Wrapper, Button, List } from "@/compoents/atoms";
import { Logo, SocialButton } from "@/compoents/molecules";
import { getTranslations } from "next-intl/server";
import { FC } from "react";

import { getLocale } from "@/utils/helpers";
import { NavListType } from "@/utils/types";

interface RootFooterProps {
  params: {
    locale: "uk" | "ru";
  };
}

const RootFooter: FC<RootFooterProps> = async ({ params }) => {
  const t = await getTranslations({
    locale: getLocale(params),
    namespace: "Nav"
  });
  return (
    <Footer className="w-full bg-black mt-16">
      <Wrapper className="py-6 md:py-10 flex justify-between gap-2 md:gap-10">
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
            <SocialButton href={"#"} />
            <SocialButton href={"#"} />
          </div>
        </div>
        <List className="flex flex-wrap w-full gap-3 justify-end md:justify-between items-start">
          {t.raw("menu").map((item: NavListType, index: number) => (
            <List.Item key={index}>
              <Button
                color="transparent"
                className="text-white text-base"
                href={item.link}
                as={"link"}
              >
                {item.name}
              </Button>
            </List.Item>
          ))}
        </List>
      </Wrapper>
    </Footer>
  );
};

export { RootFooter };
