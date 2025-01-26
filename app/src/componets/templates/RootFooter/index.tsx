import { Footer, Wrapper, Button, List, Icon } from "@/componets/atoms";
import { Logo, SocialButton } from "@/componets/molecules";
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
            className="text-white text-sm font-normal !h-4 hover:text-primary-hover"
            href={"tel:+38 (063) 616-5809"}
          >
            +38 (063) 616-5809
          </Button>
          <div className="flex gap-3 mt-4">
            <SocialButton
              href={
                "https://www.instagram.com/hookahstore.ua/?igsh=MW5yNTFjM29hang4dw%3D%3D"
              }
              icon={
                <Icon
                  type="InstagramIcon"
                  className="w-4 h-4 fill-black group-hover:fill-white"
                />
              }
            />
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
