import { App } from "./app.ts";
import { ProductModel } from "./models/product/product.ts";
import { UsersModel } from "./models/user/user.ts";
import { PersonModel } from "./models/person/person.ts";
import { ColorModel } from "./models/color/color.ts";

async function startApp() {
  const productModel = new ProductModel();
  const userModel = new UsersModel();
  const personModel = new PersonModel();
  const colorModel = new ColorModel();
  const app = new App(productModel, userModel, personModel, colorModel);
  app.listen();
}

startApp();
