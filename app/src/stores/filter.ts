import { makeObservable, observable, action } from "mobx";

export class Filter {
  filter: any = {};

  constructor() {
    makeObservable(this, {
      filter: observable
    });
  }

  initFilter = () => {};

  setFilter = () => {};

  removeFilterByName = () => {};

  resetFilter = () => {};
}
