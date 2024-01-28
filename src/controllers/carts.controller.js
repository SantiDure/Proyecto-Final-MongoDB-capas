import { cartsManager } from "../dao/cart.dao.mongoose.js";
import { cartService } from "../services/cart.service.js";
import { productService } from "../services/product.service.js";

export async function getCartsController(req, res) {
  let limit = req.query.limit;
  const data = await cartService.getCartsService({});
  try {
    if (!limit) {
      return res.json(data);
    }
    let limitedCarts = data.slice(0, limit);
    return res.json(limitedCarts);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function getCartByIdController(req, res) {
  const { cid } = req.params;
  try {
    const cartForId = await cartService
      .getCartByIdService(cid)
      .populate("products._id")
      .lean();
    return res.json({ cartForId });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function postAddProductToCartController(req, res) {
  const { cid, pid } = req.params;
  try {
    await cartsManager.addProductToCart(cid, pid);
    return res.send(cid);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

export async function postCartController(req, res) {
  try {
    await cartService.createCartService(req.body);
    res.json(req.body);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

export async function deleteCartController(req, res) {
  const { cid } = req.params;
  try {
    await cartService.updateOneService(cid, { products: [] });
    res.json(req.body);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function deleteProductOnCartController(req, res) {
  const { cid, pid } = req.params;
  try {
    const cart = await cartService.getCartByIdService(cid);
    const product = await productService.getProductByIdService(pid);
    if (!cart || !product) {
      res.status(404).send({
        message: "el producto o el carrito no fueron encontrados",
      });
    } else {
      await cartsManager.deleteProductOnCart(cid, pid);
      res.status(200).send(`product deleted id: ${pid}`);
    }
  } catch (error) {
    res.status(500);
  }
}

export async function updateCartController(req, res) {
  const { cid } = req.params;

  try {
    await cartService.updateOneService(cid, { products: [] });
    await cartService.updateOneService(cid, { products: req.body });
    res.json(cid);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function updateProductQuantityOnCartController(req, res) {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await cartService.getCartByIdService(cid);

    const product = await productService.getProductByIdService(pid);

    const updateCart = await cartService.updateOneService(
      {
        _id: cart._id,
        "products._id": product._id,
      },
      {
        $set: {
          "products.$.quantity": quantity,
        },
      }
    );

    if (updateCart) {
      return res.status(200).send("Cantidad actualizada");
    } else {
      return res.status(400).send("No se pudo actualizar la cantidad");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error interno del servidor");
  }
}
