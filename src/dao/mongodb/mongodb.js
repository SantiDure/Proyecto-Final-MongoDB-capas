import mongoose from "mongoose";
import { MONGODB_CNX_STR } from "../../config.js";

export function connectDb() {
  mongoose.connect(MONGODB_CNX_STR);
  return console.log(`DB conectada a ${MONGODB_CNX_STR}`);
}

export { productsManager } from "./models/Product.js";
export { cartsManager } from "./models/Cart.js";
