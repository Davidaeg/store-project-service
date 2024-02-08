import { App } from "./app.ts";
import { Database } from "./DB/DataBase.ts";
import { ProductModel } from "./models/product/product.ts";
import { UsersModel } from "./models/user/user.ts";

const getPool = async () => {
  const pool = await Database.getPool();
  return pool;
};

async function startApp() {
  const pool = await getPool();
  const productModel = new ProductModel(pool);
  const userModel = new UsersModel(pool);
  const app = new App(productModel, userModel);
  app.listen();
}

startApp();
