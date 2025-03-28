import type { FC } from "react";

import Card from "../Card";

interface IPreLoadProductSliderProps {
  data: any;
}

export const PreLoadProductSlider: FC<IPreLoadProductSliderProps> = ({
  data
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Card card={data.at(0)} />
      </div>
      <div className="hidden bp320:inline-block flex-1">
        <Card card={data.at(1)} />
      </div>

      <div className="hidden bp480:inline-block flex-1">
        <Card card={data.at(2)} />
      </div>

      <div className="hidden bp980:inline-block flex-1">
        <Card card={data.at(3)} />
      </div>
    </div>
  );
};
