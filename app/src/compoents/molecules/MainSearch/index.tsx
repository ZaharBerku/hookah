import { Field, Button } from "@/compoents/atoms";

const MainSearch = () => {
  return (
    <Field
      sideElements={{
        right: (
          <Button
            color="accent"
            rounded="end"
            className="!h-full px-3 !text-base md:px-6"
          >
            Пошук
          </Button>
        )
      }}
      full
      placeholder="Я шукаю..."
      className="text-base leading-5 w-full"
      classes={{
        containerInput: "gap-3 pr-0 border-light-dark-secondary md:border-black"
      }}
    />
  );
};

export { MainSearch };
