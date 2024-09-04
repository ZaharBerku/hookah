import { Icon, Typography, Button } from "@/compoents/atoms";
import { CloseButton } from "@/compoents/molecules";
import { ComponentsFilter, ComponentsFilterKeys } from "@/compoents/organisms";
import { GET_FILTER_QUERY } from "@/query/filter";
import { useQuery } from "@apollo/client";
import clsx from "clsx";
import { Form, FormikValues, Formik, useFormikContext } from "formik";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";
import { FC, memo, useEffect, useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";

import { useGetAllSearchParams, useStores } from "@/hooks";
import { usePathname, useRouter } from "@/utils/navigation";

import { FilterSkeleton } from "./FilterSkeleton";

interface FilterProps {
  fetchFilterProduct: any;
  defaultPageFitler?: string;
  onClose?: () => void;
  className?: string;
  isMobile?: boolean;
  open?: boolean;
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
        disabled={data.disabled}
        className={clsx(
          "flex justify-between items-center gap-4 w-full transition-all mb-0",
          {
            "!mb-4": open
          }
        )}
      >
        <legend className="text-base font-bold text-start">{data.label}</legend>
        {!data.disabled && (
          <Icon
            type="ChevronDownIcon"
            className={clsx("fill-black w-4 h-4 transition-all min-w-4", {
              "rotate-180": open
            })}
          />
        )}
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

const FilterForm = ({ data, isMobile }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Filter");
  const isFirstMount = useRef(false);
  const { values, submitForm, isSubmitting, dirty, setValues } =
    useFormikContext();

  const handleResetForm = () => {
    setValues({});
    router.push(pathname);
    submitForm();
  };

  useEffect(() => {
    if (isFirstMount.current && !isMobile) {
      submitForm();
    } else {
      isFirstMount.current = true;
    }
  }, [values]);

  return (
    <Form className="flex flex-col flex-1">
      <div className="flex-1 relative">
        <div className="flex flex-col gap-5 px-6 py-5 overflow-auto max-h-full absolute inset-0">
          {data.map((item: any, index: number) => {
            return <DropDownFilter key={index} data={item} />;
          })}
        </div>
      </div>
      <div className="flex bg-white md:hidden gap-2 px-5 py-4 border-t border-black border-opacity-10">
        <Button onClick={handleResetForm} type={"button"} full color="second">
          {t("actions.reset")}
        </Button>
        <Button type="submit" disabled={isSubmitting || !dirty} full>
          {t("actions.submit")}
        </Button>
      </div>
    </Form>
  );
};

const Filter: FC<FilterProps> = ({
  fetchFilterProduct,
  defaultPageFitler,
  className,
  onClose,
  isMobile,
  open
}) => {
  const t = useTranslations("Filter");
  const pathname = usePathname();
  const initialValues = useGetAllSearchParams();
  const { localization } = useStores();

  const { data, loading } = useQuery(GET_FILTER_QUERY, {
    variables: {
      locale: localization.locale,
      page: defaultPageFitler || pathname
    }
  });

  const debouncedFetch = useCallback(
    debounce(async (values: any) => {
      toast.success(t("alert"));
      await fetchFilterProduct(values);
    }, 700),
    []
  );

  const handleSubmit = async (values: FormikValues) => {
    onClose && onClose();
    await debouncedFetch(values);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "visible";
      document.body.style.touchAction = "auto";
    }
    return () => {
      document.body.style.overflow = "visible";
      document.body.style.touchAction = "auto";
    };
  }, [open]);

  if (loading) {
    return <FilterSkeleton />;
  }

  const currentFilter = data?.filters?.data?.at(0)?.attributes?.filter;

  if (!currentFilter) {
    return null;
  }

  return (
    <div
      suppressHydrationWarning
      className={"hidden md:block md:w-full md:max-w-74"}
    >
      {open && (
        <div
          onClick={() => onClose && onClose()}
          className={clsx(
            "fixed inset-0 backdrop-blur-md bg-black bg-opacity-20 z-[1000]"
          )}
        ></div>
      )}
      <div
        className={clsx(
          "w-full flex flex-col bg-white md:max-w-74 relative h-[100dvh] md:h-[calc(100dvh-120px)] overflow-hidden md:sticky top-24 md:border md:border-black md:border-opacity-10 rounded-3xl",
          className
        )}
      >
        <div className="border-b border-black border-opacity-10 flex justify-between items-center bg-white px-6 py-5">
          <Typography tag="h4" className="!text-base-lg" text={t("title")} />
          {onClose ? (
            <CloseButton onClose={onClose} />
          ) : (
            <Icon type="SettingIcon" className="w-4 h-4 md:h-6 md:w-6" />
          )}
        </div>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <FilterForm data={currentFilter} isMobile={isMobile} />
        </Formik>
      </div>
    </div>
  );
};

export { Filter };
