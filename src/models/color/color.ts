import sql, { ConnectionPool } from "mssql";
import { CreateColorDto, Color } from "./color.entity";
import { Database } from "@DB/DataBase";
import ServerError from "@errors/ServerError";
import { ErrorsName, HTTP_STATUS } from "@errors/error.enum";

export class ColorModel {
  private pool!: ConnectionPool;
  constructor() {
    this.initDB();
  }

  async initDB() {
    this.pool = Database.getInstace().getPool();
  }

  async getAll() {
    const products = await this.pool.request().query("SELECT * from Color");
    return products.recordset;
  }

  async getById({ id }: { id: number }) {
    const product = await this.pool
      .request()
      .input("input_parameter", sql.Int, id)
      .query("SELECT * from Color where colorId = @input_parameter");
    return product.recordset[0];
  }

  async create(color: CreateColorDto) {
    try {
      const createdColor = await this.pool
        .request()
        .input("Color", sql.VarChar, color.color)
        .query(
          `INSERT INTO Color (Color) 
              OUTPUT inserted.colorId 
              VALUES (@Color)`
        );
      return createdColor.recordset[0];
    } catch (error) {
      throw new ServerError({
        name: ErrorsName.InternalServerError,
        code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: "Error creating color",
        logging: true,
        context: { error },
      });
    }
  }

  async delete({ id }: { id: number }) {
    const result = await this.pool
      .request()
      .input("input_parameter", sql.Int, id)
      .query("DELETE from Color where colorId = @input_parameter");
    return result.rowsAffected[0] > 0 ? true : false;
  }

  async update(input: Partial<Color>) {
    try {
      const updatedColor = await this.pool
        .request()
        .input("Id", sql.Int, input.colorId)
        .input("Color", sql.VarChar, input.color)
        .query("UPDATE Color SET color = @Color WHERE colorId = @Id");
      console.log({ updatedColor });
    } catch (error) {
      throw new ServerError({
        name: ErrorsName.InternalServerError,
        code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: "Error updating color",
        logging: true,
        context: { error },
      });
    }
    return input;
  }
}
