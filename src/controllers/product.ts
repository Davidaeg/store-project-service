import { Request, Response } from "express";
import { ProductModel } from "../models/product/product.ts";
import { validatePartialProduct, validateProduct } from "../schemas/product.ts";
import ServerError from "@errors/ServerError.ts";
import { ErrorsName, HTTP_STATUS } from "@errors/error.enum.ts";
import { CreateProduct } from "@models/product/product.entity.ts";

export class ProductController {
  constructor(private productModel: ProductModel) {}

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
    const inputProduct: CreateProduct = { ...req.body };

    const result = validateProduct(inputProduct);

    if (!result.success) {
      throw new ServerError({
        name: ErrorsName.UnprocessableEntityException,
        code: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: JSON.parse(result.error.message),
        logging: true,
      });
    }

    const newProduct = await this.productModel.create(result.data);

    res.status(201).json(newProduct);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await this.productModel.delete({ id: Number(id) });

    if (result === false) {
      throw new ServerError({
        name: ErrorsName.NotFoundException,
        code: HTTP_STATUS.NOT_FOUND,
        message: "Product not found",
        logging: true,
      });
    }

    return res.json({ message: "Product deleted" });
  };

  update = async (req: Request, res: Response) => {
    const result = validatePartialProduct(req.body);

    if (!result.success) {
      throw new ServerError({
        name: ErrorsName.UnprocessableEntityException,
        code: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: JSON.parse(result.error.message),
        logging: true,
      });
    }

    const { id } = req.params;

    const updatedProduct = await this.productModel.update({
      ...result.data,
      productId: Number(id),
    });
    return res.json(updatedProduct);
  };

  filterByName = async (req: Request, res: Response) => {
    const { name } = req.params;
    const products = await this.productModel.filterByName({
      name: String(name),
    });
    if (products) return res.json(products);
    throw new ServerError({
      name: ErrorsName.NotFoundException,
      code: HTTP_STATUS.NOT_FOUND,
      message: "Products not found",
      logging: true,
    });
  };

  orderByPriceAsc = async (req: Request, res: Response) => {
    const products = await this.productModel.orderByPriceAsc();
    if (products) return res.json(products);
    throw new ServerError({
      name: ErrorsName.NotFoundException,
      code: HTTP_STATUS.NOT_FOUND,
      message: "Products not ordered ascendent",
      logging: true,
    });
  };

  orderByPriceDesc = async (req: Request, res: Response) => {
    const products = await this.productModel.orderByPriceDesc();
    if (products) return res.json(products);
    throw new ServerError({
      name: ErrorsName.NotFoundException,
      code: HTTP_STATUS.NOT_FOUND,
      message: "Products not ordered descendent",
      logging: true,
    });
  };
}
