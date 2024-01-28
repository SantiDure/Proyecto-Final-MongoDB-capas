import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { hashCompare } from "../utils/criptograph.js";
import { generateUniqueUsername } from "../utils/randomUserName.js";
import { cartService } from "../services/cart.service.js";
const collection = "users";
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: randomUUID },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, default: generateUniqueUsername },
    last_name: { type: String, default: "unknow" },
    age: { type: Number, default: 0 },
    cart: { type: Object, required: true },
    rol: { type: String, default: "user" },
  },
  {
    strict: "throw",
    versionKey: false,
    statics: {
      login: async function (email, password) {
        let datosUsuario;

        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
          datosUsuario = {
            email: "admin",
            first_name: "admin",
            last_name: "admin",
            rol: "admin",
          };
        } else {
          const user = await mongoose
            .model(collection)
            .findOne({ email })
            .lean();

          if (!user) {
            throw new Error("login failed");
          }

          if (!hashCompare(password, user["password"])) {
            throw new Error("login failed");
          }

          datosUsuario = {
            email: user["email"],
            first_name: user["first_name"],
            last_name: user["last_name"],
            age: user["age"],
            cart: user["cart"],
            rol: "user",
          };
        }
        return datosUsuario;
      },
    },
  }
);

export const usersManager = mongoose.model(collection, userSchema);

class UsersDaoMongoose {
  async create(data) {
    const cartToNewUser = await cartService.createCartService();
    data.cart = cartToNewUser;
    const user = await usersManager.create(data);

    return user.toObject();
  }
  async readOne(id) {
    return await usersManager.findOne({ _id: id }).lean();
  }
  async readMany(query) {
    return await usersManager.find(query).lean();
  }
  async updateOne(id, data) {
    return await usersManager
      .findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
      .lean();
  }

  async deleteOne(id) {
    return await usersManager.findOneAndDelete({ _id: id }).lean();
  }
}

export const usersDaoMongoose = new UsersDaoMongoose();
