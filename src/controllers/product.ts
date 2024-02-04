import { Request, Response } from "express";
import { ProductModel } from "../models/product.ts";
import { validatePartialProduct, validateProduct } from "../schemas/product.ts";

export class ProductController {
  private productModel: ProductModel;

  constructor(productModel: ProductModel) {
    this.productModel = productModel;
  }
  getAll = async (_req: Request, res: Response) => {
    // const { genre } = req.query;
    const products = await this.productModel.getAll();
    res.json(products);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.productModel.getById({ id: Number(id) });
    if (product) return res.json(product);
    res.status(404).json({ message: "Product not found" });
  };

  create = async (req: Request, res: Response) => {
    const result = validateProduct(req.body);

    if (!result.success) {
      // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newProduct = await this.productModel.create(result.data);

    res.status(201).json(newProduct);
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
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;

    const updatedProduct = await this.productModel.update({
      id: Number(id),
      input: result.data,
    });

    return res.json(updatedProduct);
  };
}
