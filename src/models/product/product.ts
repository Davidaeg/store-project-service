import sql, { ConnectionPool } from "mssql";
import { CreateProduct, Product } from "./product.entity.ts";

export class ProductModel {
  constructor(private pool: ConnectionPool) {}

  // private async initializePool() {
  //   this.pool = await Database.getPool();
  // }

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
          "INSERT INTO ProductsTest (Name, Image, Stock, Price, PriceWithIva, Location) VALUES (@Name, @Image, @Stock, @Price, @PriceWithIva, @Location)"
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
      .query("DELETE from ProductsTest where Id = @input_parameter");
    return result.rowsAffected[0] > 0 ? true : false;
  }

  async update({ id, input }: { id: number; input: Partial<Product> }) {
    const updatedProduct = await this.pool
      .request()
      .input("Id", sql.Int, id)
      .input("Name", sql.VarChar, input.name)
      .input("Image", sql.VarChar, input.image)
      .input("Stock", sql.Int, input.stock)
      .input("Price", sql.Decimal, input.price)
      .input("PriceWithIva", sql.Decimal, input.priceWithIva)
      .input("Location", sql.VarChar, input.location)
      .query(
        "UPDATE ProductsTest SET Name = @Name, Image = @Image, Stock = @Stock, Price = @Price, PriceWithIva = @PriceWithIva, Location = @Location WHERE Id = @Id"
      );
    return updatedProduct.recordset[0];
  }
}
