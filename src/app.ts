import express, { json } from "express";
import "express-async-errors";
import { createProductRouter } from "./routes/products.ts";
import { createPersonRouter } from "./routes/person.ts";
import { createColorRouter } from "./routes/color.ts";
import { corsMiddleware } from "./middlewares/cors.ts";
import { ProductModel } from "./models/product/product.ts";
import { PersonModel } from "./models/person/person.ts";
import { UsersModel } from "./models/user/user.ts";
import { ColorModel } from "./models/color/color.ts";
import { AuthService } from "./auth/auth.service.ts";
import { createUserRouter } from "./routes/user.ts";
import { errorHandler } from "@middlewares/errors.ts";
import "dotenv/config";

export class App {
  private app: express.Express;

  constructor(
    private productModel: ProductModel,
    private userMode: UsersModel,
    private personModel: PersonModel,
    private colorModel: ColorModel
  ) {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware() {
    this.app.use(json());
    this.app.use(errorHandler);
    this.app.use(corsMiddleware());
    this.app.disable("x-powered-by");
  }

  private setupRoutes() {
    this.app.use(
      "/products",
      createProductRouter({ productModel: this.productModel })
    );
    this.app.use(
      "/users",
      createUserRouter({
        userModel: this.userMode,
        authService: new AuthService(this.userMode),
      })
    );
    this.app.use(
      "/person",
      createPersonRouter({
        personModel: this.personModel,
        authService: new AuthService(this.userMode),
      })
    );
    this.app.use(
      "/color",
      createColorRouter({
        colorModel: this.colorModel,
        authService: new AuthService(this.userMode),
      })
    );
  }

  public listen() {
    const PORT = process.env.PORT ?? 1234;

    this.app.listen(PORT, () => {
      console.log(`server listening on port http://localhost:${PORT}`);
    });
  }
}
