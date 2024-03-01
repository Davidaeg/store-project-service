import sql, { ConnectionPool } from "mssql";
import { CreatePersonDto, Person } from "./person.entity.ts";
import { Database } from "@DB/DataBase.ts";
import ServerError from "@errors/ServerError.ts";
import { ErrorsName, HTTP_STATUS } from "@errors/error.enum.ts";

export class PersonModel {
  private pool!: ConnectionPool;
  constructor() {
    this.initDB();
  }

  async initDB() {
    this.pool = Database.getInstace().getPool();
  }

  async getById({ id }: { id: number }) {
    const person = await this.pool
      .request()
      .input("input_parameter", sql.Int, id)
      .query("SELECT * from Person where personId = @input_parameter");
    return person.recordset[0];
  }

  async getAll() {
    const person = await this.pool.request().query("SELECT * from Person");
    return person.recordset;
  }

  async create(person: CreatePersonDto) {
    try {
      const createPerson = await this.pool
        .request()
        .input("Name", sql.VarChar, person.name)
        .input("FirstLastName", sql.VarChar, person.firstLastName)
        .input("SecondLastName", sql.VarChar, person.secondLastName)
        .input("Birthday", sql.Date, person.birthday)
        .input("Email", sql.VarChar, person.email)
        .input("PhoneNumber", sql.VarChar, person.phoneNumber)
        .input("Address", sql.VarChar, person.address)
        .query(
          `INSERT INTO Person (name, firstLastName, secondLastName, birthday, email, phoneNumber, address) 
          OUTPUT inserted.personId, inserted.email
          VALUES (@Name, @FirstLastName, @SecondLastName, @Birthday, @Email, @PhoneNumber, @Address)`
        );
      return createPerson.recordset[0];
    } catch (error) {
      throw new ServerError({
        name: ErrorsName.InternalServerError,
        code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: "Error creating person",
        logging: true,
        context: { error },
      });
    }
  }

  async delete({ id }: { id: number }) {
    const result = await this.pool
      .request()
      .input("input_parameter", sql.Int, id)
      .query("DELETE from Person where personId = @input_parameter");
    return result.rowsAffected[0] > 0 ? true : false;
  }

  async update(input: Partial<Person>) {
    try {
      const updatePerson = await this.pool
        .request()
        .input("personId", sql.Int, input.personId)
        .input("Name", sql.VarChar, input.name)
        .input("FirstLastName", sql.VarChar, input.firstLastName)
        .input("SecondLastName", sql.VarChar, input.secondLastName)
        .input("Birthday", sql.Date, input.birthday)
        .input("Email", sql.VarChar, input.email)
        .input("PhoneNumber", sql.VarChar, input.phoneNumber)
        .input("Address", sql.VarChar, input.address)
        .query(
          "UPDATE Person SET name = @Name, firstLastName = @FirstLastName, secondLastName = @SecondLastName, birthday = @Birthday, email = @Email, phoneNumber = @PhoneNumber, address = @Address WHERE personId = @personId"
        );
      console.log({ updatePerson });
    } catch (error) {
      throw new ServerError({
        name: ErrorsName.InternalServerError,
        code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: "Error updating person",
        logging: true,
        context: { error },
      });
    }
    return input;
  }
}
