import { createContext } from "react";

import { Banner } from "./banner";
import { Resource } from "./resource";

export class RootStore {
  resource: Resource;
  banner: Banner;
  constructor() {
    this.resource = new Resource();
    this.banner = new Banner();
  }
}

export const rootStore = new RootStore();

export const storeContext = createContext<RootStore | null>(rootStore);
