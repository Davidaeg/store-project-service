import { App } from "./app";
import { ProductModel } from "./models/product/product";
import { UsersModel } from "./models/user/user";
import { PersonModel } from "./models/person/person";
import { ColorModel } from "./models/color/color";

async function startApp() {
  const productModel = new ProductModel();
  const userModel = new UsersModel();
  const personModel = new PersonModel();
  const colorModel = new ColorModel();
  const app = new App(productModel, userModel, personModel, colorModel);
  app.listen();
}

startApp();
