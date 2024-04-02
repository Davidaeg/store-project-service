import { Router } from "express";
import { ProductController } from "../controllers/product.ts";
import { ProductModel } from "models/product/product.ts";
import { upload } from "@utils/imageUploader.ts";

export const createProductRouter = ({
  productModel,
}: {
  productModel: ProductModel;
}) => {
  const productsRouter = Router();

  const productsController = new ProductController(productModel);

  //CRUD
  productsRouter.get("/", productsController.getAll);
  productsRouter.get("/:id", productsController.getById);
  productsRouter.post("/", productsController.create);
  productsRouter.post("/upload", upload.single("file"), (_req, res) => {
    res.status(200).send("success");
  });

  productsRouter.delete("/:id", productsController.delete);
  productsRouter.patch("/:id", productsController.update);

  //OTHER REQUESTS
  productsRouter.get("/search/:name", productsController.filterByName);
  productsRouter.get("/asc/price", productsController.orderByPriceAsc);
  productsRouter.get("/desc/price", productsController.orderByPriceDesc);

  //returning end points
  return productsRouter;
};
