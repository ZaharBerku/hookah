"use client";

import { Button, Icon, Wrapper } from "@/compoents/atoms";
import { observer } from "mobx-react";
import Link from "next/link";

import { useStores } from "@/hooks/index";

const Banner = observer(() => {
  const { banner } = useStores();

  const handleClose = () => {
    banner.closeBanner();
  };

  if (banner.isCloseBanner) {
    return null;
  }

  return (
    <div className="py-2.5 bg-primary w-full">
      <Wrapper className="flex items-center justify-center w-full">
        <span className="flex flex-wrap gap-1 flex-1 justify-center items-center">
          <span className="text-white text-xxs">
            Акційні товари зі знижкою до 20% тільки до 14.02.
          </span>
          <Link className="text-white text-sm font-bold underline" href={"#"}>
            Поспішити скристатись акцією
          </Link>
        </span>
        <Button onClick={handleClose} color="transparent" className="!h-5">
          <Icon className="w-5 h-5 fill-white" type="CloseIcon" />
        </Button>
      </Wrapper>
    </div>
  );
});

export { Banner };
