import sql, { ConnectionPool } from "mssql";
import { CreateProduct, Product } from "./product.entity";
import { Database } from "@DB/DataBase";
import ServerError from "@errors/ServerError";
import { ErrorsName, HTTP_STATUS } from "@errors/error.enum";

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
      .query("SELECT * from Product where productId = @input_parameter");
    return product.recordset[0];
  }

  async create(product: CreateProduct) {
    try {
      const createdProduct = await this.pool
        .request()
        .input("Name", sql.VarChar, product.name)
        .input("Image", sql.VarChar, product.image)
        .input("Stock", sql.Int, product.stock)
        .input("Price", sql.Decimal, product.price)
        .input("PriceWithIva", sql.Decimal, product.priceWithIva)
        .input("Location", sql.VarChar, product.location)
        .query(
          `INSERT INTO Product (Name, Image, Stock, Price, PriceWithIva, Location) 
          OUTPUT inserted.productId 
          VALUES (@Name, @Image, @Stock, @Price, @PriceWithIva, @Location)`
        );
      return createdProduct.recordset[0];
    } catch (error) {
      throw new ServerError({
        name: ErrorsName.InternalServerError,
        code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: "Error creating product",
        logging: true,
        context: { error },
      });
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
          "UPDATE Product SET name = @Name, image = @Image, stock = @Stock, price = @Price, priceWithIva = @PriceWithIva, location = @Location WHERE productId = @Id"
        );
      console.log({ updatedProduct });
    } catch (error) {
      throw new ServerError({
        name: ErrorsName.InternalServerError,
        code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: "Error updating product",
        logging: true,
        context: { error },
      });
    }
    return input;
  }

  async filterByName({ name }: { name: string }) {
    const products = await this.pool
      .request()
      .input("input_parameter", sql.VarChar, "%" + name + "%")
      .query("SELECT * FROM Product p WHERE p.name like @input_parameter");
    return products.recordset;
  }

  async orderByPriceAsc() {
    const products = await this.pool
      .request()
      .query("SELECT * FROM Product p ORDER BY PRICE ASC;");
    console.log(products);
    return products.recordset;
  }

  async orderByPriceDesc() {
    const products = await this.pool
      .request()
      .query("SELECT * FROM Product p ORDER BY PRICE DESC;");
    return products.recordset;
  }
}
