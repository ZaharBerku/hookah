import "@/compoents/molecules/Modals";;

export type Classes = {
  wrapper?: string;
  container?: string;
};

export type NavListType = {
  name: string;
  link: string;
  list?: NavListType[];
};

export type OptionsType = {
  label: string;
  value: string;
};


export type DetailType = {
  key: string;
  value: string | number;
}
