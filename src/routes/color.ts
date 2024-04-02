import { Router } from "express";
import { ColorController } from "../controllers/color.ts";
import { ColorModel } from "models/color/color.ts";
import { AuthService } from "auth/auth.service.ts";

export const createColorRouter = ({
  colorModel,
  authService,
}: {
    colorModel: ColorModel;
    authService: AuthService;
}) => {
  const colorsRouter = Router();

  const colorsController = new ColorController(colorModel);

  colorsRouter.get("/", colorsController.getAll);
  colorsRouter.post("/", colorsController.create);

  colorsRouter.get("/:id", colorsController.getById);
  colorsRouter.delete("/:id", colorsController.delete);
  colorsRouter.patch("/:id", colorsController.update);

  return colorsRouter;
};
