import { Schema, model } from "mongoose";
import { randomUUID } from "node:crypto";
import mongoosePaginate from "mongoose-paginate-v2";
const productSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    category: { type: String, default: "Otros" },
    thumbnail: { type: [String], default: [] },
  },
  {
    strict: "throw",
    versionKey: false,
  }
);

productSchema.plugin(mongoosePaginate);

export const productsManager = model("products", productSchema);

class ProductsDaoMongoose {
  async create(data) {
    const product = await productsManager.create(data);
    return product.toObject();
  }
  async readOne(id) {
    return await productsManager.findOne({ _id: id }).lean();
  }
  async readMany(query) {
    return await productsManager.find(query).lean();
  }
  async updateOne(id, data) {
    return await productsManager
      .findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
      .lean();
  }

  async deleteOne(id) {
    return await productsManager.findOneAndDelete({ _id: id }).lean();
  }
}

export const productsDaoMongoose = new ProductsDaoMongoose();
