import { Router } from "express";
import { ColorController } from "../controllers/color";
import { ColorModel } from "models/color/color";
import { AuthService } from "auth/auth.service";

export const createColorRouter = ({
  colorModel,
  authService,
}: {
  colorModel: ColorModel;
  authService: AuthService;
}) => {
  const colorsRouter = Router();

  const colorsController = new ColorController(colorModel);
  
  //CRUD
  colorsRouter.get("/", colorsController.getAll);
  colorsRouter.post("/", colorsController.create);
  colorsRouter.get("/:id", colorsController.getById);
  colorsRouter.delete("/:id", colorsController.delete);
  colorsRouter.patch("/:id", colorsController.update);

  //OTHER REQUESTS
  colorsRouter.get("/product/:productId", colorsController.getProductColors)

  return colorsRouter;
};
