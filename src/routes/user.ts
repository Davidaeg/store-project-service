import { AuthService } from "auth/auth.service";
import { UserController } from "../controllers/user";
import { Router } from "express";
import { UsersModel } from "../models/user/user";

export const createUserRouter = ({
  userModel,
  authService,
}: {
  userModel: UsersModel;
  authService: AuthService;
}) => {
  const userRouter = Router();

  const usersController = new UserController(userModel, authService);

  userRouter.get("/", usersController.getAll);
  userRouter.get("/:id", usersController.getById);

  userRouter.delete("/:id", usersController.delete);
  userRouter.post("/signup", usersController.create);
  userRouter.post("/signin", usersController.signin);

  return userRouter;
};
