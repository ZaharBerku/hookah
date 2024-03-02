export const getMenu = async () => {
  return {
    data: await Promise.resolve(require("./menu.mock.ts").menu),
  };
};
