import { makeObservable, observable, action } from "mobx";

import { calculeteAmountWithDiscount } from "@/utils/helpers";
import { localStorageKeys } from "@/utils/variables";

export class Cart {
  cart: any = [];
  amount: number = 0;
  totalProductQuantity: number = 0;

  constructor() {
    makeObservable(this, {
      cart: observable,
      amount: observable,
      totalProductQuantity: observable,
      addProductToCart: action,
      removeProductFromCart: action,
      incrementNumberOfProductInCart: action,
      decrementNumberOfProductInCart: action
    });

    this.init();
  }

  init = () => {
    try {
      if (typeof window !== "undefined") {
        const value = localStorage?.getItem(localStorageKeys.cart);
        if (value) {
          this.cart = JSON.parse(value);
          this.calculeteSumProductsWithDiscount();
          this.calculeteTotalProductQuantity();
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  setToLocalStorage = () => {
    localStorage.setItem(localStorageKeys.cart, JSON.stringify(this.cart));
  };

  getIndexProduct = (id: number) => {
    const index = this.cart.findIndex((product: any) => product.id === id);
    //check if the product was found
    return index === -1 ? null : index;
  };

  calculeteTotalProductQuantity = () => {
    const totalQuantity = this.cart.reduce(
      (item: number, { quantity }: any) => item + quantity,
      0
    );
    this.totalProductQuantity = totalQuantity;
  };

  calculeteSumProductsWithDiscount = () => {
    const amount = this.cart.reduce(
      (item: number, { price, discount, quantity }: any) =>
        item +
        Math.floor(calculeteAmountWithDiscount(price, discount) * quantity),
      0
    );
    this.amount = amount;
  };

  valuesCalculete = () => {
    this.calculeteSumProductsWithDiscount();
    this.calculeteTotalProductQuantity();
    this.setToLocalStorage();
  };

  addProductToCart = (product: any) => {
    const index = this.getIndexProduct(product.id);
    if (index === null) {
      this.cart = [...this.cart, { ...product, quantity: 1 }];
    } else {
      this.incrementNumberOfProductInCart(product.id);
    }
    this.valuesCalculete();
  };

  removeProductFromCart = (id: number) => {
    const copyCart = [...this.cart.filter((product: any) => product.id !== id)];
    console.log(id, Object.assign([], copyCart));

    this.cart = copyCart;
    this.valuesCalculete();
  };

  incrementNumberOfProductInCart = (id: number) => {
    const productIndex = this.getIndexProduct(id);
    if (productIndex !== null) {
      const copyCart = [...this.cart];
      const product = copyCart[productIndex];
      product.quantity += 1;
      this.cart = copyCart;
      this.valuesCalculete();
    }
  };

  decrementNumberOfProductInCart = (id: number) => {
    const productIndex = this.getIndexProduct(id);
    if (productIndex !== null) {
      const copyCart = [...this.cart];
      const product = copyCart[productIndex];
      product.quantity -= 1;

      if (!product.quantity) {
        this.removeProductFromCart(id);
      }

      this.cart = copyCart;
      this.valuesCalculete();
    }
  };

  setNumberOfProductInCart = (id: number, quantity: number) => {
    const productIndex = this.getIndexProduct(id);
    if (productIndex !== null) {
      const copyCart = [...this.cart];
      const product = copyCart[productIndex];
      if (quantity) {
        product.quantity = quantity;
      } else {
        this.removeProductFromCart(id);
      }

      this.cart = copyCart;
      this.valuesCalculete();
    }
  };
}
