import { GET_PRODUCTS_BY_COMPOSITE_ID_QUERY } from "@/query/schema";
import {
  makeObservable,
  observable,
  action,
  computed,
  runInAction,
  autorun
} from "mobx";

import { queryPublicGraphql } from "@/lib/publicGraphql";
import {
  calculeteAmountWithDiscount,
  getAvailableQuantity,
  getLocale,
  MAX_ITEM_QUANTITY
} from "@/utils/helpers";
import { localStorageKeys, modalNames } from "@/utils/variables";

import { RootStore } from "./index";

export class Cart {
  selectedProducts: any = {};
  cart: any = [];
  loading: boolean = false;
  promocode: any = null;
  store: RootStore;

  constructor(store: RootStore) {
    this.store = store;
    makeObservable(this, {
      selectedProducts: observable,
      cart: observable,
      loading: observable,
      promocode: observable,
      amount: computed,
      amountWithDiscount: computed,
      totalProductsQuantity: computed,
      unavailableItems: computed,
      hasUnavailableItems: computed,
      refetchProductsInTheCart: action,
      addProductToCart: action,
      removeProductFromCart: action,
      incrementNumberOfProductInCart: action,
      decrementNumberOfProductInCart: action,
      setPromocode: action,
      setProductsToCart: action,
      clearCart: action
    });

    this.init();

    autorun(() => {
      this.valuesCalculete();
    });
  }

  init = () => {
    try {
      if (typeof window !== "undefined") {
        const value = localStorage?.getItem(localStorageKeys.cart);
        if (value) {
          this.selectedProducts = JSON.parse(value);
        }
      }
    } catch (error: any) {
      throw Error(error);
    }
  };

  valuesCalculete = () => {
    this.calculeteSumProductsWithDiscount();
    this.calculeteTotalProductQuantity();
    this.setToLocalStorage();
  };

  refetchProductsInTheCart = async () => {
    this.loading = true;
    try {
      const locale = this.store.localization.locale;
      const data = await queryPublicGraphql({
        query: GET_PRODUCTS_BY_COMPOSITE_ID_QUERY,
        variables: {
          locale: getLocale({ locale }),
          compositeIds: Object.keys(this.selectedProducts)
        }
      });

      runInAction(() => {
        this.cart = data.products.data;
        this.loading = false;
      });
      return true;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      return false;
    }
  };

  clearCart = () => {
    this.selectedProducts = {};
    this.cart = [];
    this.valuesCalculete();
  };

  getProductByCompositeIdFromLocalStorage = (compositeId: string) => {
    const product = this.selectedProducts[compositeId];
    return product;
  };

  setToLocalStorage = () => {
    if (typeof window !== "undefined") {
      localStorage?.setItem(
        localStorageKeys.cart,
        JSON.stringify(this.selectedProducts)
      );
    }
  };

  setProductsToCart = (products: any) => {
    this.cart = products;
  };

  calculeteTotalProductQuantity = () => {
    const totalQuantity = Object.values(this.selectedProducts).reduce(
      (item: number, { quantity }: any) => item + quantity,
      0
    );
    return totalQuantity;
  };

  setPromocode = (promocode: any) => {
    this.promocode = promocode;
  };

  calculeteSumProductsWithDiscount = () => {
    const { amount, amountWithDiscount } = this.cart.reduce(
      (
        item: {
          amount: number;
          amountWithDiscount: number;
        },
        { attributes }: any
      ) => {
        const { price, discount, compositeId, category } = attributes;
        const currentCategory = category.data.attributes.name;
        const promocodeCategories = this.promocode?.categories?.data?.map(
          (item: any) => item.attributes.name
        );
        item.amountWithDiscount += Math.floor(
          calculeteAmountWithDiscount(
            price,
            promocodeCategories?.includes(currentCategory)
              ? this.promocode?.discount || 0
              : discount
          ) * (this.selectedProducts[compositeId]?.quantity || 1)
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
    return { amount, amountWithDiscount };
  };

  addProductToCart = (product: any) => {
    const foundProduct = this.getProductByCompositeIdFromLocalStorage(
      product.attributes.compositeId
    );
    if (foundProduct === undefined) {
      this.selectedProducts = {
        [product.attributes.compositeId]: { ...product, quantity: 1 },
        ...this.selectedProducts
      };
    } else {
      this.incrementNumberOfProductInCart(product.attributes.compositeId);
    }
  };

  removeProductFromCart = (compositeId: string) => {
    const copyCart = { ...this.selectedProducts };
    delete copyCart[compositeId];
    this.selectedProducts = copyCart;
    this.cart = this.cart.filter(
      (product: any) => product.attributes.compositeId !== compositeId
    );
  };

  incrementNumberOfProductInCart = (compositeId: string) => {
    const foundProduct =
      this.getProductByCompositeIdFromLocalStorage(compositeId);
    if (foundProduct !== undefined) {
      const copyCart = { ...this.selectedProducts };
      const product = copyCart[compositeId];
      product.quantity = Math.min(product.quantity + 1, MAX_ITEM_QUANTITY);
      this.selectedProducts = copyCart;
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
    const foundProduct =
      this.getProductByCompositeIdFromLocalStorage(compositeId);
    if (foundProduct !== undefined) {
      const copyCart = { ...this.selectedProducts };
      const product = copyCart[compositeId];
      const result = product.quantity - 1;

      if (result) {
        product.quantity = result;
        this.selectedProducts = copyCart;
      } else {
        this.openRemoveModal(compositeId);
      }
    }
  };

  setNumberOfProductInCart = (compositeId: string, quantity: number) => {
    const foundProduct =
      this.getProductByCompositeIdFromLocalStorage(compositeId);
    if (foundProduct !== undefined) {
      const copyCart = { ...this.selectedProducts };
      const product = copyCart[compositeId];

      if (quantity) {
        product.quantity = quantity;
        this.selectedProducts = copyCart;
      } else {
        this.openRemoveModal(compositeId);
      }
    }
  };

  get amount() {
    const { amount } = this.calculeteSumProductsWithDiscount();
    return amount;
  }

  get amountWithDiscount() {
    const { amountWithDiscount } = this.calculeteSumProductsWithDiscount();
    return amountWithDiscount;
  }

  get unavailableItems(): {
    compositeId: string;
    name: string;
    available: number;
  }[] {
    return this.cart.flatMap(({ attributes }: any) => {
      const { compositeId, name, numberOf } = attributes;
      const available = getAvailableQuantity(numberOf);
      const quantity = this.selectedProducts[compositeId]?.quantity || 0;
      return quantity > available ? [{ compositeId, name, available }] : [];
    });
  }

  get hasUnavailableItems() {
    return this.unavailableItems.length > 0;
  }

  get totalProductsQuantity() {
    return this.calculeteTotalProductQuantity();
  }
}
