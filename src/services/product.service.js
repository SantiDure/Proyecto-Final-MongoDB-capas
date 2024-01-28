import { productsDaoMongoose } from "../dao/product.dao.mongoose.js";

class ProductService {
  async createProductService(data) {
    const product = await productsDaoMongoose.create(data);
    return product;
  }

  async getProductsService() {
    return await productsDaoMongoose.readMany({});
  }

  async getProductByIdService(id) {
    const productForId = await productsDaoMongoose.readOne({ _id: id });
    return productForId;
  }

  async updateOneService(id, data) {
    return productsDaoMongoose.updateOne(id, data);
  }

  async delteOneService(id) {
    return productsDaoMongoose.deleteOne(id);
  }
}

export const productService = new ProductService();
