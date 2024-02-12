import { Request, Response } from "express";
import { ProductModel } from "../models/product/product.ts";
import { validatePartialProduct, validateProduct } from "../schemas/product.ts";
import ServerError from "@errors/ServerError.ts";
import { ErrorsName, HTTP_STATUS } from "@errors/error.enum.ts";

export class ProductController {
  private productModel: ProductModel;

  constructor(productModel: ProductModel) {
    this.productModel = productModel;
  }
  getAll = async (_req: Request, res: Response) => {
    const products = await this.productModel.getAll();
    res.json(products);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.productModel.getById({ id: Number(id) });
    if (product) return res.json(product);
    throw new ServerError({
      name: ErrorsName.NotFoundException,
      code: HTTP_STATUS.NOT_FOUND,
      message: "Product not found",
      logging: true,
    });
  };

  create = async (req: Request, res: Response) => {
    const result = validateProduct(req.body);

    if (!result.success) {
      throw new ServerError({
        name: ErrorsName.UnprocessableEntityException,
        code: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: JSON.parse(result.error.message),
        logging: true,
      });
    }
    try {
      const newProduct = await this.productModel.create(result.data);

      res.status(201).json(newProduct);
    } catch (error) {
      throw new ServerError({
        name: ErrorsName.InternalServerError,
        code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: "Error creating product",
        logging: true,
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await this.productModel.delete({ id: Number(id) });

    if (result === false) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product deleted" });
  };

  update = async (req: Request, res: Response) => {
    const result = validatePartialProduct(req.body);

    if (!result.success) {
      return res.status(422).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    try {
      const updatedProduct = await this.productModel.update({
        ...result.data,
        productId: Number(id),
      });
      return res.json(updatedProduct);
    } catch (error) {
      throw new ServerError({
        name: ErrorsName.InternalServerError,
        code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: "Error updating product",
        logging: true,
      });
    }
  };
}
