import {
  getCartByIdController,
  postCartController,
  postAddProductToCartController,
  getCartsController,
  deleteCartController,
  deleteProductOnCartController,
  updateCartController,
  updateProductQuantityOnCartController,
} from "../controllers/carts.controller.js";
import { Router } from "express";
export const cartRouter = Router();
cartRouter.get("/:cid", getCartByIdController);
cartRouter.get("/", getCartsController);
cartRouter.post("/", postCartController);
cartRouter.post("/:cid/product/:pid", postAddProductToCartController);
cartRouter.put("/:cid", updateCartController);
cartRouter.put("/:cid/products/:pid", updateProductQuantityOnCartController);
cartRouter.delete("/:cid", deleteCartController);
cartRouter.delete("/:cid/products/:pid", deleteProductOnCartController);
