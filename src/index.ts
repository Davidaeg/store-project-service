import express, { json } from "express";
import { createProductRouter } from "./routes/products.ts";
import { corsMiddleware } from "./middlewares/cors.ts";
import "dotenv/config";
import { ProductModel } from "./models/product.ts";

export class App {
  private productModel: ProductModel;
  private app: express.Express;

  constructor(productModel: ProductModel) {
    this.productModel = productModel;
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware() {
    this.app.use(json());
    this.app.use(corsMiddleware());
    this.app.disable("x-powered-by");
  }

  private setupRoutes() {
    this.app.use(
      "/products",
      createProductRouter({ productModel: this.productModel })
    );
  }

  public listen() {
    const PORT = process.env.PORT ?? 1234;

    this.app.listen(PORT, () => {
      console.log(`server listening on port http://localhost:${PORT}`);
    });
  }
}

const productModel = new ProductModel();
const app = new App(productModel);
app.listen();
