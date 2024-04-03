import { ConnectionPool } from "mssql";
import { CreateUserDto, User, UserType } from "./user.entity";
import { Person } from "models/person/person.entity";
import { Database } from "@DB/DataBase";
import { userRootPathMap, userRoutesMap } from "./userRoutes";
import ServerError from "../../errors/ServerError";
import { ErrorsName, HTTP_STATUS } from "../../errors/error.enum";

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
    const user = await this.pool.request().query("SELECT * FROM [User]");
    return user.recordset as User[];
  }

  async findByEmail(email: string) {
    const user = await this.pool
      .request()
      .query(`SELECT * FROM [User] WHERE username = '${email}'`);
    return user.recordset[0] as User;
  }

  async findByEmailforLogin(email: string) {
    const userQuery = await this.pool
      .request()
      .query(`SELECT * FROM [User] WHERE username = '${email}'`);

    const userResult = userQuery.recordset[0] as User;
    if (!userResult) {
      throw new ServerError({
        name: ErrorsName.NotFoundException,
        code: HTTP_STATUS.NOT_FOUND,
        message: "User not found",
        logging: true,
      });
    }

    const customerQuery = await this.pool
      .request()
      .query(`SELECT * FROM Customer WHERE personId = ${userResult.personId}`);
    const customer = customerQuery.recordset[0];
    if (customer) {
      return {
        ...userResult,
        id: userResult.userId,
        userType: UserType.CUSTOMER,
        rootPath: userRootPathMap[UserType.CUSTOMER],
        routes: userRoutesMap[UserType.CUSTOMER],
      };
    }

    const employeeQuery = await this.pool
      .request()
      .query(`SELECT * FROM Employee WHERE personId = ${userResult.personId}`);
    const employee = employeeQuery.recordset[0];
    if (employee) {
      return {
        ...userResult,
        id: userResult.userId,
        userType: UserType.EMPLOYEE,
        rootPath: userRootPathMap[UserType.EMPLOYEE],
        routes: userRoutesMap[UserType.EMPLOYEE],
      };
    }
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
