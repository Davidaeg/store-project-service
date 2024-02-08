import { AuthService } from "auth/auth.service";
import { UserController } from "../controllers/user.ts";
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

  const productsController = new UserController(userModel, authService);

  userRouter.get("/", productsController.getAll);
  userRouter.get("/:id", productsController.getById);

  userRouter.delete("/:id", productsController.delete);
  //   productsRouter.patch("/:id", productsController.update);
  userRouter.post("/signup", productsController.create);
  userRouter.post("/signin", productsController.sigin);

  return userRouter;
};
