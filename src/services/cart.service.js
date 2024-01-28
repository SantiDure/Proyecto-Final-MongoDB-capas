import { cartsDaoMongoose } from "../dao/cart.dao.mongoose.js";

class CartService {
  async createCartService(data) {
    const cart = await cartsDaoMongoose.create(data);
    return cart;
  }

  async getCartsService() {
    return await cartsDaoMongoose.readMany({});
  }

  async getCartByIdService(id) {
    const cartForId = await cartsDaoMongoose.readOne(id);
    return cartForId;
  }

  async updateOneService(id, data) {
    return cartsDaoMongoose.updateOne(id, data);
  }

  async delteOneService(id) {
    return cartsDaoMongoose.deleteOne(id);
  }
}

export const cartService = new CartService();
