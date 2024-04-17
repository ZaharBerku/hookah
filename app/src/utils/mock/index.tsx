import { NavListType } from "@/utils/types";

export const navList: NavListType[] = [
  {
    name: "Кальяни 1",
    link: "/hook",
    list: [
      {
        name: "Колауд2",
        link: "/test",
        list: [
          {
            name: "Горіхове3",
            link: "/test2"
          }
        ]
      },
      {
        name: "Колауди2",
        link: "/test5",
        list: [
          {
            name: "Горіхове3",
            link: "/test23"
          }
        ]
      }
    ]
  },
  {
    name: "Кальяни 2",
    link: "/hook2",
    list: [
      {
        name: "Колауди",
        link: "/test",
        list: [
          {
            name: "Горіхове",
            link: "/test2"
          }
        ]
      },
      {
        name: "Колауди",
        link: "/test",
        list: [
          {
            name: "Горіхове",
            link: "/test2"
          }
        ]
      }
    ]
  }
];
