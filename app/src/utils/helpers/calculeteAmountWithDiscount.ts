const calculeteAmountWithDiscount = (price: number, discount: number) => {
  const priceWithDiscount = discount ? Math.floor(price - price * (discount / 100)) : price;
  return priceWithDiscount;
};

export { calculeteAmountWithDiscount };
