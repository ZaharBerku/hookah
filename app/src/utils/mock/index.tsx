import { NavListType } from "@/utils/types";

export const navList: NavListType[] = [
  {
    name: "Кальяни",
    link: "/hookah"
  },
  {
    name: "Табак",
    link: "/tobacco",
    list: [
      {
        name: "420",
        link: "/420"
      },
      {
        name: "Absolem",
        link: "/absolem"
      },
      {
        name: "Flow",
        link: "/flow"
      },
      {
        name: "Indigo",
        link: "/indigo"
      },
      {
        name: "Swipe",
        link: "/swipe"
      },
      {
        name: "White Smok",
        link: "/white-smok"
      },
    ]
  }
];

