import { Typography } from "@/compoents/atoms";
import { FC } from "react";

interface SectionNameProps {
  name: string;
  content: string;
}

const SectionName: FC<SectionNameProps> = ({ name, content }) => {
  return (
    <div className="flex flex-col items-start gap-2 md:gap-6">
      <span>{content}</span>
      <Typography tag="h3" className="text-xl font-bold leading-12" text={name} />
    </div>
  );
};

export { SectionName };
