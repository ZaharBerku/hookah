import { createContext } from "react";

import { Banner } from "./banner";
import { Cart } from "./cart";
import { Modal } from "./modal";
import { Products } from "./products";
import { Resource } from "./resource";

export class RootStore {
  resource: Resource;
  banner: Banner;
  cart: Cart;
  products: Products;
  modal: Modal;
  constructor() {
    this.resource = new Resource();
    this.banner = new Banner();
    this.cart = new Cart(this);
    this.products = new Products();
    this.modal = new Modal();
  }
}

export const rootStore = new RootStore();

export const storeContext = createContext<RootStore | null>(rootStore);
