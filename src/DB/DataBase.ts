import mssql, { ConnectionPool } from "mssql";

export class Database {
  private static pool: ConnectionPool;

  public static async getPool() {
    if (!this.pool) {
      try {
        this.pool = await new mssql.ConnectionPool({
          user: `${process.env.DB_USER}`,
          password: `${process.env.DB_PASSWORD}`,
          server: `${process.env.DB_HOST}`,
          database: `${process.env.DB_NAME}`,
          options: {
            trustServerCertificate: true,
            trustedConnection: true,
            enableArithAbort: true,
          },
        }).connect();
        console.log("Connected to MSSQL database");
      } catch (error) {
        console.error("Error connecting to MSSQL database:", error);
        process.exit(1);
      }
    }

    return this.pool;
  }
}
