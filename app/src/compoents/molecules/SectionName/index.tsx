import { Typography } from "@/compoents/atoms";
import { FC } from "react";

interface SectionNameProps {
  name: string;
  content: string;
}

const SectionName: FC<SectionNameProps> = ({ name, content }) => {
  return (
    <div className="flex flex-col items-start gap-2 md:gap-6">
      <span className="text-primary flex items-center gap-4 text-3xs font-bold before:block before:h-8.5 before:md:h-10 before:w-5 before:rounded before:bg-primary">
        {content}
      </span>
      <Typography
        tag="h3"
        className="font-bold leading-12"
        text={name}
      />
    </div>
  );
};

export { SectionName };
