import { Button } from "@/compoents/atoms";
import { FC, ReactNode } from "react";

interface SocialButtonProps {
  icon?: ReactNode;
  href: string;
}

const SocialButton: FC<SocialButtonProps> = ({ icon: Icon, href }) => {
  return (
    <Button
      as={"link"}
      href={href}
      className="!w-7 !h-7 rounded-full bg-white"
      color="transparent"
    >
      {Icon}
    </Button>
  );
};

export { SocialButton };