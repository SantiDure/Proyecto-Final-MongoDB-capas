import fs from "fs/promises";
import { Product } from "../models/Product.js";
import crypto from "crypto";
class ProductManager {
  constructor(path) {
    this.path = path;
  }

  //crea un id auto incrementable

  //agrega un producto
  async addProduct({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  }) {
    const products = await this.getProducts();
    const productToAdd = products.find((product) => product.code === code);
    const id = crypto.randomUUID();
    const newProduct = new Product({
      id,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    });
    // Verificar si ya existe un producto con el mismo código
    if (!productToAdd) {
      products.push(newProduct);
      await fs.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
      return;
    }
    throw new Error(
      `El producto con el codigo ${code} ya existe, no puede volver a agregarse`
    );
  }

  //consultar por todos los productos
  async getProducts() {
    const data = await fs.readFile(this.path, "utf-8");
    return JSON.parse(data) || [];
  }

  //consultar por un producto especificado por id
  async getProductById(id) {
    const products = await this.getProducts();
    const productToFind = products.find((p) => p.id === id);
    if (!productToFind) {
      throw new Error(`El producto con id ${id} no se encuentra o no existe`);
    }
    return productToFind;
  }

  async updateProduct(id, newData) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((i) => i.id === id);
    if (productIndex !== -1) {
      const product = products[productIndex];
      try {
        products[productIndex] = { ...product, ...newData };
        await fs.writeFile(
          this.path,
          JSON.stringify(products, null, 2),
          "utf-8"
        );
      } catch (error) {
        throw new Error(
          `Error al actualizar el producto, faltan campos a rellenar: ${error}`
        );
      }
      return;
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((i) => i.id === id);
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      await fs.writeFile(this.path, JSON.stringify(products, null, 2), "utf8");
      return;
    }
    throw new Error(`El producto con id ${id} no se encuentra o no existe`);
  }
}

export const productManager = new ProductManager("./db/products.json");
