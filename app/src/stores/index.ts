import { createContext } from "react";
import { Resource } from "./resource";

export class RootStore {
  resource: Resource;
  constructor() {
    this.resource = new Resource();
  }
}

export const rootStore = new RootStore();

export const storeContext = createContext<RootStore | null>(rootStore);
