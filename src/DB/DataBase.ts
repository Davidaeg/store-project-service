import mssql, { ConnectionPool } from "mssql";

export class Database {
  private pool: ConnectionPool;
  private static instance: Database;

  public static getInstace() {
    if (!Database.instance) {
      this.instance = new Database();
    }
    return Database.instance;
  }

  private constructor() {
    this.pool = new mssql.ConnectionPool({
      user: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASSWORD}`,
      server: `${process.env.DB_HOST}`,
      database: `${process.env.DB_NAME}`,
      options: {
        trustServerCertificate: true,
        trustedConnection: true,
        enableArithAbort: true,
      },
    });
    this.connect();
  }

  async connect() {
    await this.pool.connect();
    console.log("Connected to MSSQL database");
  }

  getPool() {
    return this.pool;
  }
}
