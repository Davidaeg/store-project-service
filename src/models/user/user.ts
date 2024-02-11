import { ConnectionPool } from "mssql";
import { CreateUserDto, User } from "./user.entity";
import { Person } from "models/person/person.entity";
import { Database } from "@DB/DataBase";

export class UsersModel {
  private pool!: ConnectionPool;
  constructor() {
    this.initDB();
  }

  async initDB() {
    this.pool = Database.getInstace().getPool();
  }

  async create(attrs: CreateUserDto) {
    const person = await this.findPersonByEmail(attrs.username);

    if (!person) {
      throw new Error(
        ` Las dependencias no existen: {persona: ${
          attrs.username || "no encontrada"
        }`
      );
    }

    const user = {
      password: attrs.password,
      username: attrs.username,
      personId: person.personId,
    };

    const newUser = await this.pool
      .request()
      .input("password", user.password)
      .input("username", user.username)
      .input("personId", user.personId).query(`
      INSERT INTO [User] (password, username, personId)
      OUTPUT inserted.userId 
      VALUES (@password, @username, @personId)
    `);
    if (newUser.rowsAffected[0] === 0) {
      throw new Error("No se pudo crear el usuario");
    }

    return {
      userId: newUser.recordset[0].userId,
      username: attrs.username,
      name: person.name,
    };
  }

  async findOne(id: number) {
    if (!id) {
      return null;
    }
    const user = await this.pool
      .request()
      .query(`SELECT * FROM [User] WHERE id = ${id}`);
    return user.recordset[0] as User;
  }

  async getAll() {
    const users = await this.pool.request().query("SELECT * FROM [User]");
    return users.recordset as User[];
  }

  async findByEmail(email: string) {
    const user = await this.pool
      .request()
      .query(`SELECT * FROM [User] WHERE username = '${email}'`);
    return user.recordset[0] as User;
  }

  async findByPersonId({ id }: { id: number }) {
    const user = await this.pool
      .request()
      .query(`SELECT * FROM [User] WHERE personId = ${id}`);
    return user.recordset[0] as User;
  }

  async findPersonByEmail(email: string) {
    const person = await this.pool
      .request()
      .query(`SELECT * FROM Person WHERE email = '${email}'`);
    return person.recordset[0] as Person;
  }

  async remove({ id }: { id: number }) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    const result = await this.pool
      .request()
      .query(`DELETE FROM [User] WHERE id = ${id}`);
    if (result.rowsAffected[0] === 0) {
      throw new Error("No se pudo eliminar el usuario");
    }
    return user;
  }
}
