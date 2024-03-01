import plugin from "tailwindcss/plugin";

type ExtraFonts = {
  name: string;
  multiplicator: number;
};

type ResponsiveText = {
  extraFonts: ExtraFonts[];
};

const parsePx = (px: string) => {
  return Number(px.slice(0, -2));
};

const pxToRem = (px: number) => {
  return `${px / 16}rem`;
};

export const responsiveTextPlugin = ({ extraFonts }: ResponsiveText) =>
  plugin(({ theme, addComponents }) => {
    const textTheme = theme("text") || {};
    const screens = theme("screens") || {};

    const createStyles = (config: any, extraFont?: any) => {
      const multiplicator = extraFont?.multiplicator || 1;

      const styles: any = {
        fontSize: pxToRem(parsePx(config.DEFAULT.fontSize) * multiplicator),
        lineHeight: config.DEFAULT.lineHeight,
        letterSpacing: config.DEFAULT.letterSpacing,
        fontWeight: config.DEFAULT.fontWeight,
      };

      Object.keys(screens).forEach((key) => {
        if (config[key]) {
          styles[`@media (min-width: ${screens[key]})`] = {
            fontSize: pxToRem(parsePx(config[key].fontSize) * multiplicator),
            lineHeight: config[key].lineHeight,
            letterSpacing: config[key].letterSpacing,
            fontWeight: config[key].fontWeight,
          };
        }
      });
      return styles;
    };

    const components = Object.keys(textTheme).reduce((all: any, key) => {
      const config = textTheme[key];
      all[`.text-${key}`] = createStyles(config);

      extraFonts?.forEach((extraFont: any) => {
        all[`.text-${key}-${extraFont.name}`] = createStyles(config, extraFont);
      });

      return all;
    }, {});
    addComponents(components);
  });
