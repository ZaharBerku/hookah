import { nextui } from "@nextui-org/theme";
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import { responsiveTextPlugin } from "./src/utils/plugins/responsiveTextPlugin";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/skeleton.js"
  ],
  theme: {
    screens: {
      'bp320': '320px',
      xxs: "375px",
      xs: "475px",
      'bp480': '480px',
      sm: "640px",
      md: "768px",
      'bp840': '840px',
      'bp980': '980px',
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
      "base-lg": {
        DEFAULT: {
          fontWeight: "700",
          fontSize: "20px",
          lineHeight: "27px"
        }
      },
      "base-xl": {
        DEFAULT: {
          fontWeight: "700",
          fontSize: "24px",
          lineHeight: "32px"
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
      }
    },
    extend: {
      gridTemplateColumns: {
        "auto-fill": "repeat(auto-fill, minmax(300px, 1fr))",
        "auto-fill-mobile": "repeat(auto-fill, minmax(150px, 1fr))",
        "auto-fill-card-mobile": "repeat(auto-fill, minmax(150px, 1fr))",
        "auto-fill-card": "repeat(auto-fill, minmax(300px, 1fr))"
      },
      colors: {
        primary: "#F57906",
        "primary-hover": "#D76903",
        secondary: "#CDD0D3",
        accent: "#EDF0F2",
        "primary-content": "#1C1C21",
        "secondary-content": "#F6E2E2",
        "accent-content": "#FF3333",
        "primary-base": "#939393",
        label: "#1A1A1A",
        "secondary-base": "#686868",
        "custom-accent-base": "#F5F5F5",
        dark: "#646464",
        "card-shadow-color": "rgba(109, 115, 122, 0.15)",
        catalog: "rgba(104, 104, 104, 0.6)",
        "light-dark": "#F9F9F9",
        "light-dark-secondary": "#EDEDED",
        "light-dark-accent": "#DEDEDE",
        light: "#F0F0F0",
        "primary-green": "#20A200",
        sour: "#78BD17",
        spicy: "#702408",
        freshness: "#096DCB",
        sweetness: "#F57906"
      },
      boxShadow: {
        "3xl": "-24px 18px 100px 0px",
        "4xl": "-16px 12px 67px 0px",
        circle: "0px 0px 3px 2px"
      },
      backgroundImage: {
        "gradient-spicy":
          "linear-gradient(-90deg, rgba(152, 65, 9, 0.34), rgba(245, 121, 6, 0))",
        "gradient-sour":
          "linear-gradient(-90deg, rgba(128, 210, 11, 0.34), rgba(128, 210, 11, 0))",
        "gradient-sweetness":
          "linear-gradient(-90deg, rgba(245, 121, 6, 0.34), rgba(245, 121, 6, 0))",
        "gradient-freshness":
          "linear-gradient(-90deg, rgba(9, 109, 203, 0.34), rgba(33, 188, 181, 0))",
        "gradient-primary": "linear-gradient(95deg, #F57906, #FF7A00)",
        "gradient-primary-disabled":
          "linear-gradient(95deg, #686868B2, #686868B2)"
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
        "15": "3.75rem",
        "23": "5.3125rem",
        "49": "12.375rem",
        "74": "18.4375rem",
        "148": "35rem",
        "11/12": "90%"
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
    nextui(),
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
