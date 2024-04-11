import { Router } from "express";
import { PersonController } from "../controllers/person";
import { PersonModel } from "models/person/person";
import { AuthService } from "auth/auth.service";

export const createPersonRouter = ({
  personModel,
  authService,
}: {
  personModel: PersonModel;
  authService: AuthService;
}) => {
  const personRouter = Router();

  const personController = new PersonController(personModel, authService);

  personRouter.get("/", personController.getAll);
  personRouter.post("/", personController.create);
  personRouter.get("/:id", personController.getById);
  personRouter.delete("/:id", personController.delete);
  personRouter.patch("/:id", personController.update);

  return personRouter;
};
