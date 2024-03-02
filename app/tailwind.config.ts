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
      xxs: "375px",
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1240px"
    },
    text: {
      default: {
        DEFAULT: {
          fontWeight: "400",
          fontSize: "12px",
          lineHeight: "18px"
        },
        xs: {
          fontSize: "12px"
        },
        sm: {
          fontSize: "13px"
        },
        md: {
          fontSize: "14px"
        }
      },
      "2xs": {
        DEFAULT: {
          fontWeight: "400",
          fontSize: "8px",
          lineHeight: "11px"
        },
        xs: {
          fontSize: "8px"
        },
        sm: {
          fontSize: "10px"
        },
        md: {
          fontSize: "12px"
        }
      },
      xs: {
        DEFAULT: {
          fontWeight: "700",
          fontSize: "11px",
          lineHeight: "15px"
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
      lg: {
        DEFAULT: {
          fontWeight: "700",
          fontSize: "16px",
          lineHeight: "21px"
        },
        xs: {
          fontSize: "16px"
        },
        sm: {
          fontSize: "18px"
        },
        md: {
          fontSize: "20px"
        }
      },
      xl: {
        DEFAULT: {
          fontWeight: "700",
          fontSize: "20px",
          lineHeight: "27px"
        },
        xs: {
          fontSize: "20px"
        },
        sm: {
          fontSize: "22px"
        },
        md: {
          fontSize: "24px"
        }
      },
      "2xl": {
        DEFAULT: {
          fontWeight: "700",
          fontSize: "24px",
          lineHeight: "48px"
        },
        xs: {
          fontSize: "20px"
        },
        sm: {
          fontSize: "22px"
        },
        md: {
          fontSize: "36px"
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
