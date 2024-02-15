import { Router } from "express";
import { PersonController } from "../controllers/person.ts";
import { PersonModel } from "models/person/person.ts";

export const createPersonRouter = ({
  personModel,
}: {
  personModel: PersonModel;
}) => {
  const personRouter = Router();

  const personController = new PersonController(personModel);

  personRouter.get("/", personController.getAll);
  personRouter.post("/", personController.create);
  personRouter.get("/:id", personController.getById);
  personRouter.delete("/:id", personController.delete);
  personRouter.patch("/:id", personController.update);

  return personRouter;
};
