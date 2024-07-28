import { Icon } from "@/compoents/atoms";
import { ComponentsFilter, ComponentsFilterKeys } from "@/compoents/organisms";
import { GET_FILTER_QUERY } from "@/query/filter";
import { useQuery } from "@apollo/client";
import clsx from "clsx";
import { Form, FormikValues, Formik, useFormikContext } from "formik";
import { debounce } from "lodash";
import { FC, memo, useEffect, useRef, useState, useCallback } from "react";

import { useGetAllSearchParams, useStores } from "@/hooks";

import { FilterSkeleton } from "./FilterSkeleton";

interface FilterProps {
  fetchFilterProduct: any;
  category: string;
  className?: string;
}

interface FieldsProps {
  data: any;
  generalName: string;
  generalTypeFields: ComponentsFilterKeys;
  open: boolean;
}

const Fields: FC<FieldsProps> = memo(
  ({ data, generalName, generalTypeFields, open }) => {
    const Component = ComponentsFilter[generalTypeFields];
    return (
      <div
        className={clsx(
          "flex flex-col gap-2.5 max-h-74 h-full transition-all",
          {
            "!max-h-0": !open,
            "overflow-y-auto": data.length > 1
          }
        )}
      >
        {data.map((field: any) => {
          const { name, ...props } = field;
          return (
            <Component
              name={name || generalName}
              key={field.value}
              {...props}
            />
          );
        })}
      </div>
    );
  }
);

Fields.displayName = "Fields";

const DropDownFilter = ({ data }: any) => {
  const [open, setOpen] = useState(Boolean(data.defaultValueDropdown));

  const handleToggle = () => {
    setOpen((currentValue) => !currentValue);
  };

  return (
    <fieldset role="group" aria-labelledby="checkbox-group">
      <button
        onClick={handleToggle}
        type="button"
        className={clsx(
          "flex justify-between items-center gap-4 w-full transition-all mb-0",
          {
            "!mb-4": open
          }
        )}
      >
        <legend className="text-base font-bold text-start">{data.label}</legend>
        <Icon
          type="ChevronDownIcon"
          className={clsx("fill-black w-4 h-4 transition-all min-w-4", {
            "rotate-180": open
          })}
        />
      </button>
      <Fields
        data={data.data}
        open={open}
        generalName={data.generalName}
        generalTypeFields={data.generalTypeFields}
      />
    </fieldset>
  );
};

const FilterForm = ({ data, className }: any) => {
  const isFirstMount = useRef(false);
  const { values, submitForm } = useFormikContext();

  useEffect(() => {
    if (isFirstMount.current) {
      submitForm();
    } else {
      isFirstMount.current = true;
    }
  }, [values]);

  return (
    <Form
      className={clsx(
        "w-full h-[calc(100vh-120px)] flex flex-col gap-5 md:max-w-74 overflow-auto md:border md:border-black md:border-opacity-10 rounded-3xl px-6 py-5 sticky top-24",
        className
      )}
    >
      {data.map((item: any, index: number) => {
        return <DropDownFilter key={index} data={item} />;
      })}
    </Form>
  );
};

const Filter: FC<FilterProps> = ({
  fetchFilterProduct,
  category = "hookah",
  className
}) => {
  const initialValues = useGetAllSearchParams();
  const { localization } = useStores();
  const { data, loading } = useQuery(GET_FILTER_QUERY, {
    variables: {
      locale: localization.locale,
      category
    }
  });

  const debouncedFetch = useCallback(
    debounce(async (values: any) => {
      await fetchFilterProduct(values);
    }, 700),
    []
  );

  const handleSubmit = async (values: FormikValues) => {
    await debouncedFetch(values);
  };

  if (loading) {
    return <FilterSkeleton />;
  }

  const currentFilter = data?.filters?.data?.at(0)?.attributes?.filter;

  if (!currentFilter) {
    return null;
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <FilterForm data={currentFilter} className={className} />
    </Formik>
  );
};

export { Filter };
