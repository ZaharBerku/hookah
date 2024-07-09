import { makeObservable, observable, action, runInAction } from "mobx";

import { calculeteAmountWithDiscount } from "@/utils/helpers";
import { localStorageKeys, modalNames } from "@/utils/variables";

import { RootStore } from "./index";

export class Cart {
  selectedProducts: any = {};
  cart: any = [];
  amount: number = 0;
  amountWithDiscount: number = 0;
  totalProductQuantity: number = 0;
  store: RootStore;

  constructor(store: RootStore) {
    this.store = store;
    makeObservable(this, {
      cart: observable,
      selectedProducts: observable,
      amount: observable,
      totalProductQuantity: observable,
      addProductToCart: action,
      removeProductFromCart: action,
      incrementNumberOfProductInCart: action,
      decrementNumberOfProductInCart: action,
      setProductsToCart: action,
      clearCart: action
    });

    this.init();
  }

  init = () => {
    try {
      if (typeof window !== "undefined") {
        const value = localStorage?.getItem(localStorageKeys.cart);
        if (value) {
          this.selectedProducts = JSON.parse(value);
          this.calculeteTotalProductQuantity();
          this.calculeteSumProductsWithDiscount(Object.values(this.selectedProducts));
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  setProductsToCart = (products: any) => {
    this.cart = products;
    this.calculeteSumProductsWithDiscount(this.cart);
  };

  setToLocalStorage = () => {
    localStorage.setItem(
      localStorageKeys.cart,
      JSON.stringify(this.selectedProducts)
    );
  };

  getProduct = (compositeId: string) => {
    const product = this.selectedProducts[compositeId];
    return product;
  };

  calculeteTotalProductQuantity = () => {
    const totalQuantity = Object.values(this.selectedProducts).reduce(
      (item: number, { quantity }: any) => item + quantity,
      0
    );
    this.totalProductQuantity = totalQuantity;
  };

  calculeteSumProductsWithDiscount = (products: any) => {
    const { amount, amountWithDiscount } = products.reduce(
      (
        item: {
          amount: number;
          amountWithDiscount: number;
        },
        { attributes: { price, discount, compositeId } }: any
      ) => {
        item.amountWithDiscount += Math.floor(
          calculeteAmountWithDiscount(price, discount) *
            this.selectedProducts[compositeId].quantity
        );
        item.amount += Math.floor(
          price * this.selectedProducts[compositeId].quantity
        );
        return item;
      },
      {
        amount: 0,
        amountWithDiscount: 0
      }
    );
    this.amount = amount;
    this.amountWithDiscount = amountWithDiscount;
  };

  valuesCalculete = () => {
    this.calculeteSumProductsWithDiscount(Object.values(this.selectedProducts));
    this.calculeteTotalProductQuantity();
    this.setToLocalStorage();
  };

  addProductToCart = (product: any) => {
    const foundProduct = this.getProduct(product.attributes.compositeId);
    if (foundProduct === undefined) {
      this.selectedProducts = {
        ...this.selectedProducts,
        [product.attributes.compositeId]: { ...product, quantity: 1 }
      };
    } else {
      this.incrementNumberOfProductInCart(product.compositeId);
    }
    this.valuesCalculete();
  };

  removeProductFromCart = (compositeId: string) => {
    const copyCart = { ...this.selectedProducts };
    delete copyCart[compositeId];
    this.selectedProducts = copyCart;
    this.valuesCalculete();
  };

  clearCart = () => {
    this.selectedProducts = {};
    this.cart = [];
    this.valuesCalculete();
  };

  incrementNumberOfProductInCart = (compositeId: string) => {
    const foundProduct = this.getProduct(compositeId);
    if (foundProduct !== undefined) {
      const copyCart = { ...this.selectedProducts };
      const product = copyCart[compositeId];
      product.quantity += 1;
      this.selectedProducts = copyCart;
      this.valuesCalculete();
    }
  };

  openRemoveModal = (compositeId: string) => {
    runInAction(() => {
      this.store.modal.data = {
        [modalNames.ModalDeleteProductFromCart]: {
          compositeId
        }
      };
      this.store.modal.openModal(modalNames.ModalDeleteProductFromCart);
    });
  };

  decrementNumberOfProductInCart = (compositeId: string) => {
    const foundProduct = this.getProduct(compositeId);
    if (foundProduct !== undefined) {
      const copyCart = { ...this.selectedProducts };
      const product = copyCart[compositeId];
      const result = product.quantity - 1;

      if (result) {
        product.quantity = result;
        this.selectedProducts = copyCart;
        this.valuesCalculete();
      } else {
        this.openRemoveModal(compositeId);
      }
    }
  };

  setNumberOfProductInCart = (compositeId: string, quantity: number) => {
    const foundProduct = this.getProduct(compositeId);
    if (foundProduct !== undefined) {
      const copyCart = { ...this.selectedProducts };
      const product = copyCart[compositeId];

      if (quantity) {
        product.quantity = quantity;
        this.selectedProducts = copyCart;
        this.valuesCalculete();
      } else {
        this.openRemoveModal(compositeId);
      }
    }
  };
}
