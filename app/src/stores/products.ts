import { makeObservable, observable, action } from "mobx";

export class Products {
  products: any = [];

  constructor() {
    makeObservable(this, {
      products: observable,
      likeProduct: action
    });
  }

  likeProduct = (id: number) => {};
}
