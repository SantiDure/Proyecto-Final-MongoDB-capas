import { Schema, model } from "mongoose";
import { randomUUID } from "node:crypto";
import { productsDaoMongoose } from "../dao/mongodb.js";
const cartSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    products: [
      {
        _id: { type: String, ref: "products" },
        quantity: { type: Number, default: 0 },
      },
    ],
  },
  {
    strict: "throw",
    versionKey: false,
    statics: {
      addProductToCart: async function (cid, pid) {
        const initialQuantity = 1;

        const cart = await model("carts", cartSchema).findById(cid);
        const product = await productsDaoMongoose.readOne({ _id: pid });

        const productIndexFind = cart.products.findIndex(
          (p) => p._id === product._id
        );

        if (productIndexFind === -1) {
          await model("carts", cartSchema).findOneAndUpdate(
            { _id: cid },
            {
              $addToSet: {
                products: { _id: product._id, quantity: initialQuantity },
              },
            }
          );
        } else {
          await model("carts", cartSchema).findOneAndUpdate(
            { _id: cid, "products._id": product._id },
            {
              $inc: {
                "products.$.quantity": initialQuantity,
              },
            }
          );
        }
      },
      deleteProductOnCart: async function (cid, pid) {
        try {
          const cart = await model("carts", cartSchema).findById(cid);
          const product = await productsDaoMongoose.readOne(pid).lean();

          const productIndexFind = cart.products.findIndex(
            (p) => p._id === product._id
          );
          if (productIndexFind !== -1) {
            cart.products.splice(productIndexFind, 1);

            await cart.save();

            return cart;
          } else {
            throw new Error("Producto no encontrado en el carrito");
          }
        } catch (error) {
          console.log(error);
        }
      },
      updateProductQuantityOnCart: async function (cid, pid) {},
    },
  }
);

cartSchema.pre("find", function (next) {
  this.populate("products._id");
  next();
});

export const cartsManager = model("carts", cartSchema);

class CartDaoMongoose {
  async create(data) {
    const cart = await cartsManager.create(data);
    return cart;
  }
  async readOne(id) {
    return await cartsManager.findOne({ _id: id });
  }
  async readMany(query) {
    return await cartsManager.find(query).toObject();
  }
  async updateOne(id, data) {
    return await cartsManager
      .findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
      .toObject();
  }

  async deleteOne(id) {
    return await cartsManager.findOneAndDelete({ _id: id }).toObject();
  }
}

export const cartsDaoMongoose = new CartDaoMongoose();
