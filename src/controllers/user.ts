import { Request, Response } from "express";

import { UsersModel } from "../models/user/user.ts";
import { AuthService } from "../auth/auth.service.ts";
import { validateUser } from "../schemas/user.ts";

export class UserController {
  constructor(
    private userModel: UsersModel,
    private authService: AuthService
  ) {}
  getAll = async (_req: Request, res: Response) => {
    const products = await this.userModel.getAll();
    res.json(products);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.userModel.findByPersonId({ id: Number(id) });
    if (product) return res.json(product);
    res.status(404).json({ message: "Product not found" });
  };

  create = async (req: Request, res: Response) => {
    const result = validateUser(req.body);
    if (!result.success) {
      // 422 Unprocessable Entity
      return res.status(422).json({ error: JSON.parse(result.error.message) });
    }

    try {
      const user = await this.authService.signup(
        result.data.username,
        result.data.password
      );

      res.status(201).json(user);
    } catch (error: any) {
      console.error("Error creating user:", error.message);
      res.status(500).json({ message: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await this.userModel.remove({ id: Number(id) });

      if (!result) {
        return res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      console.log("Error deleting product:", error);
      return res.status(500).json({ message: "Error deleting product" });
    }

    return res.json({ message: "Product deleted" });
  };

  sigin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await this.authService.signin(email, password);
      res.json(user);
    } catch (error) {
      console.log("Error signing in:", error);
      res.status(401).json({ message: "Error signing in" });
    }
  };
}
