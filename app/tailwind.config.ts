import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import { responsiveTextPlugin } from "./src/utils/plugins/responsiveTextPlugin";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    screens: {
      xxs: "375px",
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1240px"
    },
    fontSize: {},
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
      xxs: {
        DEFAULT: {
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
      "3xs": {
        DEFAULT: {
          fontSize: "14px",
          lineHeight: "20px"
        },
        xs: {
          fontSize: "14px"
        },
        sm: {
          fontSize: "16px"
        },
        md: {
          fontSize: "16px"
        }
      },
      xs: {
        DEFAULT: {
          fontSize: "12px",
          lineHeight: "16px"
        }
      },
      sm: {
        DEFAULT: {
          fontSize: "14px",
          lineHeight: "20px"
        }
      },
      base: {
        DEFAULT: {
          fontSize: "16px",
          lineHeight: "24px"
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
      "3xl": {
        DEFAULT: {
          fontWeight: "700",
          fontSize: "20px",
          lineHeight: "48px"
        },
        xs: {
          fontSize: "20px"
        },
        sm: {
          fontSize: "24px"
        },
        md: {
          fontSize: "30px"
        }
      },
      "4xl": {
        DEFAULT: {
          fontWeight: "700",
          fontSize: "24px",
          lineHeight: "48px"
        },
        xs: {
          fontSize: "24px"
        },
        sm: {
          fontSize: "28px"
        },
        md: {
          fontSize: "36px"
        }
      },

    },
    extend: {
      colors: {
        primary: "#F57906",
        "primary-hover": "#D76903",
        secondary: "#CDD0D3",
        accent: "#EDF0F2",
        "primary-content": "#1C1C21",
        "secondary-content": "#F6E2E2",
        "accent-content": "#FF3333",
        "primary-base": "#939393",
        "secondary-base": "#686868",
        "accent-base": "#F5F5F5",
        dark: "#646464",
        "card-shadow-color": "rgba(109, 115, 122, 0.15)",
        catalog: "rgba(104, 104, 104, 0.6)",
        "light-dark": "#F9F9F9",
        "light-dark-secondary": "#EDEDED"
      },
      boxShadow: {
        "3xl": "-24px 18px 100px 0px"
      },
      borderRadius: {
        "20": "20px",
        "9xl": "62px"
      },
      lineHeight: {
        "4.5": "1.125rem",
        "12": "48px"
      },
      spacing: {
        "4.5": "1.125rem",
        "8.5": "1.875rem",
        "12.5": "3.125rem",
        "15": "3.75rem"
      },
      strokeWidth: {
        "3": "3px",
        "4": "4px"
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
