import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import { responsiveTextPlugin } from "./src/utils/plugins/responsiveTextPlugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      "2lg": "1168px",
      xl: "1280px",
      "2xl": "1536px"
    },
    text: {
      name: {
        DEFAULT: {
          fontWeight: "400",
          fontSize: "14px",
          lineHeight: "143%"
        },
        xs: {
          fontSize: "18px"
        },
        sm: {
          fontSize: "24px"
        },
        md: {
          fontSize: "30px"
        }
      },
      title: {
        DEFAULT: {
          fontWeight: "700",
          fontSize: "35px",
          lineHeight: "143%"
        },
        xs: {
          fontSize: "35px"
        },
        sm: {
          fontSize: "38px"
        },
        md: {
          fontSize: "48px"
        }
      },
      "body-7xl": {
        DEFAULT: {
          fontWeight: "400",
          fontSize: "92px",
          lineHeight: "60%"
        },
        xs: {
          fontSize: "138px"
        },
        sm: {
          fontSize: "184px"
        },
        md: {
          fontSize: "230px"
        }
      },
      "body-6xl": {
        DEFAULT: {
          fontWeight: "700",
          fontSize: "40px",
          lineHeight: "110%"
        },
        xs: {
          fontSize: "48px"
        },
        sm: {
          fontSize: "80px"
        },
        md: {
          fontSize: "104px"
        }
      },
      "body-5xl": {
        DEFAULT: {
          fontWeight: "700",
          fontSize: "30px",
          lineHeight: "144%"
        },
        xs: {
          fontSize: "30px"
        },
        sm: {
          fontSize: "30px"
        },
        md: {
          fontSize: "38px"
        }
      },
      "body-4xl": {
        DEFAULT: {
          fontWeight: "700",
          fontSize: "16px",
          lineHeight: "144%"
        },
        xs: {
          fontSize: "20px"
        },
        sm: {
          fontSize: "26px"
        },
        md: {
          fontSize: "32px"
        }
      },
      "span-2xl": {
        DEFAULT: {
          fontWeight: "700",
          fontSize: "10px",
          lineHeight: "144%"
        },
        xs: {
          fontSize: "12px"
        },
        sm: {
          fontSize: "14px"
        },
        md: {
          fontSize: "18px"
        }
      },
      "span-xl": {
        DEFAULT: {
          fontWeight: "400",
          fontSize: "9px",
          lineHeight: "144%"
        },
        xs: {
          fontSize: "11px"
        },
        sm: {
          fontSize: "13px"
        },
        md: {
          fontSize: "16px"
        }
      },
      "primary-button": {
        DEFAULT: {
          fontSize: "12px",
          lineHeight: "145%"
        },
        xs: {
          fontSize: "14px"
        },
        sm: {
          fontSize: "19px"
        },
        md: {
          fontSize: "24px"
        }
      }
    },
    extend: {
      borderRadius: {
        "9xl": "62px"
      },
      lineHeight: {
        "4.5": "1.125rem"
      },
      spacing: {
        "4.5": "1.125rem"
      }
    }
  },
  plugins: [
    responsiveTextPlugin({
      extraFonts: [{ name: "serif", multiplicator: 1.08 }]
    }),
    plugin(({ addComponents, addUtilities }: any) => {
      addComponents({
        ".flex-wrapper-center": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row"
        },
        ".flex-wrapper-column": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }
      });
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none"
          }
        },
        ".horizontal-tb": {
          writingMode: "horizontal-tb"
        },
        ".vertical-rl": {
          writingMode: "vertical-rl"
        },
        ".vertical-lr": {
          writingMode: "vertical-lr"
        },
        ".scrollbar-default": {
          /* IE and Edge */
          "-ms-overflow-style": "auto",
          /* Firefox */
          "scrollbar-width": "auto",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "block"
          }
        }
      });
    })
  ]
};
export default config;
