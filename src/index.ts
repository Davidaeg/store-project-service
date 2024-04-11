import { App } from "./app";
import { ProductModel } from "./models/product/product";
import { UsersModel } from "./models/user/user";
import { PersonModel } from "./models/person/person";
import { ColorModel } from "./models/color/color";
import { OrdersModel } from "./models/order/order";

async function startApp() {
  const productModel = new ProductModel();
  const userModel = new UsersModel();
  const personModel = new PersonModel();
  const colorModel = new ColorModel();
  const ordersModel = new OrdersModel();
  const app = new App(productModel, userModel, personModel, colorModel, ordersModel);
  app.listen();
}

startApp();
