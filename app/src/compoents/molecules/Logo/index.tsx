import { Icon } from "@/compoents/atoms";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"}>
      <Icon type="LogoWithNameIcon" className=" text-primary" />
    </Link>
  );
};

export { Logo };
