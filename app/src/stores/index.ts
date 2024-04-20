import { createContext } from "react";

import { Banner } from "./banner";
import { Cart } from "./cart";
import { Products } from "./products";
import { Resource } from "./resource";

export class RootStore {
  resource: Resource;
  banner: Banner;
  cart: Cart;
  products: Products;
  constructor() {
    this.resource = new Resource();
    this.banner = new Banner();
    this.cart = new Cart();
    this.products = new Products();
  }
}

export const rootStore = new RootStore();

export const storeContext = createContext<RootStore | null>(rootStore);
