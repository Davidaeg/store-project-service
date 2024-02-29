import { Request, Response } from "express";

import { UsersModel } from "../models/user/user.ts";
import { AuthService } from "../auth/auth.service.ts";
import { validateUser } from "../schemas/user.ts";
import ServerError from "@errors/ServerError.ts";
import { ErrorsName, HTTP_STATUS } from "@errors/error.enum.ts";

export class UserController {
  constructor(
    private userModel: UsersModel,
    private authService: AuthService
  ) {}
  getAll = async (_req: Request, res: Response) => {
    const User = await this.userModel.getAll();
    res.json(User);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userModel.findByPersonId({ id: Number(id) });
    if (user) return res.json(user);
    res.status(404).json({ message: "user not found" });
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
      throw new ServerError({
        name: ErrorsName.InternalServerError,
        code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: "Error creating user",
        logging: true,
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await this.userModel.remove({ id: Number(id) });

      if (!result) {
        return res.status(404).json({ message: "user not found" });
      }
    } catch (error) {
      throw new ServerError({
        name: ErrorsName.InternalServerError,
        code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: "Error deleting user",
        logging: true,
      });
    }

    return res.json({ message: "user deleted" });
  };

  signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await this.authService.signin(email, password);
      res.json(user);
    } catch (error) {
      throw new ServerError({
        name: ErrorsName.Unauthorized,
        code: HTTP_STATUS.UNAUTHORIZED,
        message: "Invalid email or password",
        logging: true,
      });
    }
  };
}
