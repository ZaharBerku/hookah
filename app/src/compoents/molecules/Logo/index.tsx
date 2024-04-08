import { Icon } from "@/compoents/atoms";
import Link from "next/link";

const Logo = () => {
  return (
    <Link className="hidden md:block" href={"/"}>
      <Icon type="LogoWithNameIcon" className=" text-primary" />
    </Link>
  );
};

export { Logo };
