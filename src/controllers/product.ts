import { Request, Response } from "express";
import { ProductModel } from "../models/product.ts";
import { validateMovie, validatePartialMovie } from "../schemas/product.ts";

export class ProductController {
  private productModel: ProductModel;

  constructor(productModel: ProductModel) {
    this.productModel = productModel;
  }
  getAll = async (_req: Request, res: Response) => {
    // const { genre } = req.query;
    const movies = await this.productModel.getAll();
    res.json(movies);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const movie = await this.productModel.getById({ id: Number(id) });
    if (movie) return res.json(movie);
    res.status(404).json({ message: "Movie not found" });
  };

  create = async (req: Request, res: Response) => {
    const result = validateMovie(req.body);

    if (!result.success) {
      // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = await this.productModel.create(result.data);

    res.status(201).json(newMovie);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await this.productModel.delete({ id: Number(id) });

    if (result === false) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.json({ message: "Movie deleted" });
  };

  update = async (req: Request, res: Response) => {
    const result = validatePartialMovie(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;

    const updatedMovie = await this.productModel.update({
      id: Number(id),
      input: result.data,
    });

    return res.json(updatedMovie);
  };
}
