import { storeContext } from "@/stores/index";
import { useContext } from "react";

const useStores = () => {
  const context = useContext(storeContext);
  if (context === null) {
    throw Error("No context");
  }
  return context;
};

export { useStores };
