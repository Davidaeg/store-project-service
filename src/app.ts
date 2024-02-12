import express, { json } from "express";
import "express-async-errors";
import { createProductRouter } from "./routes/products.ts";
import { corsMiddleware } from "./middlewares/cors.ts";
import { ProductModel } from "./models/product/product.ts";
import { UsersModel } from "./models/user/user.ts";
import { AuthService } from "./auth/auth.service.ts";
import { createUserRouter } from "./routes/user.ts";
import { errorHandler } from "@middlewares/errors.ts";
import "dotenv/config";

export class App {
  private app: express.Express;

  constructor(
    private productModel: ProductModel,
    private userMode: UsersModel
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
  }

  public listen() {
    const PORT = process.env.PORT ?? 1234;

    this.app.listen(PORT, () => {
      console.log(`server listening on port http://localhost:${PORT}`);
    });
  }
}
