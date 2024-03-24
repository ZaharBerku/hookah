import { Field, Icon, Button } from "@/compoents/atoms";

const MainSearch = () => {
  return (
    <Field
      sideElements={{
        left: <Icon className="w-6 h-6 fill-black" type="SearchIcon" />,
        right: <Button color="accent" rounded="end" className="!h-full px-6">Пошук</Button>
      }}
      full
      placeholder="Я шукаю..."
      className="text-base leading-5"
      classes={{
        containerInput: "gap-3 pr-0"
      }}
    />
  );
};

export { MainSearch };
