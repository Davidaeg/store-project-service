import { App } from "./app.ts";
import { ProductModel } from "./models/product/product.ts";
import { UsersModel } from "./models/user/user.ts";
import { PersonModel } from "./models/person/person.ts";

async function startApp() {
  const productModel = new ProductModel();
  const userModel = new UsersModel();
  const personModel = new PersonModel();
  const app = new App(productModel, userModel, personModel);
  app.listen();
}

startApp();
