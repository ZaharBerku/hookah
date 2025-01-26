import { Button } from "@/componets/atoms";
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
      className="!w-7 !h-7 rounded-full bg-white group hover:bg-primary-hover"
      color="transparent"
    >
      {Icon}
    </Button>
  );
};

export { SocialButton };
