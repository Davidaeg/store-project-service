import sql, { ConnectionPool } from "mssql";
import { CreateProduct, Product } from "./product.entity.ts";
import { Database } from "@DB/DataBase.ts";

export class ProductModel {
  private pool!: ConnectionPool;
  constructor() {
    this.initDB();
  }

  async initDB() {
    this.pool = Database.getInstace().getPool();
  }

  async getAll() {
    const products = await this.pool.request().query("SELECT * from Product");
    return products.recordset;
  }

  async getById({ id }: { id: number }) {
    const product = await this.pool
      .request()
      .input("input_parameter", sql.Int, id)
      .query("SELECT * from Product where Id = @input_parameter");
    return product.recordsets;
  }

  async create(product: CreateProduct) {
    const newProduct = {
      ...product,
    };
    try {
      const createdProduct = await this.pool
        .request()
        .input("Name", sql.VarChar, newProduct.name)
        .input("Image", sql.VarChar, newProduct.image)
        .input("Stock", sql.Int, newProduct.stock)
        .input("Price", sql.Decimal, newProduct.price)
        .input("PriceWithIva", sql.Decimal, newProduct.priceWithIva)
        .input("Location", sql.VarChar, newProduct.location)
        .query(
          `INSERT INTO Product (Name, Image, Stock, Price, PriceWithIva, Location) 
          OUTPUT inserted.productId 
          VALUES (@Name, @Image, @Stock, @Price, @PriceWithIva, @Location)`
        );
      return createdProduct.recordset[0];
    } catch (error) {
      console.log("Error creating product:", error);
      throw error;
    }
  }

  async delete({ id }: { id: number }) {
    const result = await this.pool
      .request()
      .input("input_parameter", sql.Int, id)
      .query("DELETE from Product where Id = @input_parameter");
    return result.rowsAffected[0] > 0 ? true : false;
  }

  async update(input: Partial<Product>) {
    try {
      const updatedProduct = await this.pool
        .request()
        .input("Id", sql.Int, input.productId)
        .input("Name", sql.VarChar, input.name)
        .input("Image", sql.VarChar, input.image)
        .input("Stock", sql.Int, input.stock)
        .input("Price", sql.Decimal, input.price)
        .input("PriceWithIva", sql.Decimal, input.priceWithIva)
        .input("Location", sql.VarChar, input.location)
        .query(
          "UPDATE Product SET Name = @Name, Image = @Image, Stock = @Stock, Price = @Price, PriceWithIva = @PriceWithIva, Location = @Location WHERE Id = @Id"
        );
      console.log({ updatedProduct });
    } catch (error) {
      console.log("Error updating product[ProductModel]:", error);
      throw error;
    }
    return input;
  }
}
