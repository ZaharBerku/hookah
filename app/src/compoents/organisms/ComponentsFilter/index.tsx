import { Checkbox } from "@/compoents/atoms";
import { SliderBar } from "@/compoents/molecules";
import { useFormikContext } from "formik";
import { FC } from "react";

import { useURLParams } from "@/hooks";

interface ComponentsFilterType {
  Slider: FC<any>;
  Checkbox: FC<any>;
}

export type ComponentsFilterKeys = keyof ComponentsFilterType;

const ComponentsFilter: ComponentsFilterType = {
  Slider: (props) => {
    return <SliderBar {...props} />;
  },
  Checkbox: (props) => {
    const { updateURLParams } = useURLParams();
    const { getFieldProps, setFieldValue } = useFormikContext();
    const field = getFieldProps(props.name);

    const handleChange = () => {
      const set = new Set(field.value || []);
      if (set.has(props.value)) {
        set.delete(props.value);
      } else {
        set.add(props.value);
      }
      const result = Array.from(set);
      updateURLParams(props.name, result.length ? result : undefined);
      setFieldValue(props.name, result.length ? result : undefined);
    };

    return (
      <Checkbox
        {...props}
        onChange={handleChange}
        checked={field.value?.includes(props.value)}
      />
    );
  }
};

export { ComponentsFilter };
