import { Router } from "express";
import { ProductController } from "../controllers/product.ts";
import { ProductModel } from "../models/product.ts";

export const createProductRouter = ({
  productModel,
}: {
  productModel: ProductModel;
}) => {
  const productsRouter = Router();

  const productsController = new ProductController(productModel);

  productsRouter.get("/", productsController.getAll);
  productsRouter.post("/", productsController.create);

  productsRouter.get("/:id", productsController.getById);
  productsRouter.delete("/:id", productsController.delete);
  productsRouter.patch("/:id", productsController.update);

  return productsRouter;
};
