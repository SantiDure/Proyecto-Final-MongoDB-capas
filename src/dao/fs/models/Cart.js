import { notNull } from "./Product.js";

export class Cart {
  constructor(id, products = []) {
    this.id = notNull(id);
    this.products = products;
  }
}
