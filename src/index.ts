import { App } from "./app.ts";
import { ProductModel } from "./models/product/product.ts";
import { UsersModel } from "./models/user/user.ts";

async function startApp() {
  const productModel = new ProductModel();
  const userModel = new UsersModel();
  const app = new App(productModel, userModel);
  app.listen();
}

startApp();
