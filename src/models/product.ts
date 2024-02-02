import { readJSON } from "../utils/readJson.ts";
import { Database } from "../DB/DataBase.ts";
import sql, { ConnectionPool } from "mssql";

const products = readJSON("./src/products.json") as unknown as Product[];

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  iventoryStatus?: string;
};

export class ProductModel {
  private pool!: ConnectionPool;
  constructor() {
    this.initializePool();
  }

  private async initializePool() {
    this.pool = await Database.getPool();
  }

  async getAll() {
    const products = await this.pool
      .request()
      .query("SELECT * from ProductsTest");
    return products.recordset;
  }

  async getById({ id }: { id: number }) {
    const product = await this.pool
      .request()
      .input("input_parameter", sql.Int, id)
      .query("SELECT * from Orders where Id = @input_parameter");
    return product.recordsets;
  }

  async create(product: Product) {
    const newMovie = {
      ...product,
    };

    products.push(newMovie);

    return newMovie;
  }

  async delete({ id }: { id: number }) {
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) return false;

    products.splice(productIndex, 1);
    return true;
  }

  async update({ id, input }: { id: number; input: Partial<Product> }) {
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) return false;

    products[productIndex] = {
      ...products[productIndex],
      ...input,
    };

    return products[productIndex];
  }
}
