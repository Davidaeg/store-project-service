import { Request, Response } from "express";
import { PersonModel } from "../models/person/person.ts";
import { validatePartialPerson, validatePerson } from "../schemas/person.ts";
import ServerError from "@errors/ServerError.ts";
import { ErrorsName, HTTP_STATUS } from "@errors/error.enum.ts";

export class PersonController {
  private personModel: PersonModel;

  constructor(personModel: PersonModel) {
    this.personModel = personModel;
  }

  getAll = async (_req: Request, res: Response) => {
    const person = await this.personModel.getAll();
    res.json(person);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const person = await this.personModel.getById({ id: Number(id) });
    if (person) return res.json(person);
    throw new ServerError({
      name: ErrorsName.NotFoundException,
      code: HTTP_STATUS.NOT_FOUND,
      message: "Person not found",
      logging: true,
    });
  };

  create = async (req: Request, res: Response) => {
    const result = validatePerson(req.body);

    if (!result.success) {
      throw new ServerError({
        name: ErrorsName.UnprocessableEntityException,
        code: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: JSON.parse(result.error.message),
        logging: true,
      });
    }

    const newPerson = await this.personModel.create(result.data);

    res.status(201).json(newPerson);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.personModel.delete({ id: Number(id) });

    if (result === false) {
      throw new ServerError({
        name: ErrorsName.NotFoundException,
        code: HTTP_STATUS.NOT_FOUND,
        message: "Person not found",
        logging: true,
      });
    }

    return res.json({ message: "Person deleted" });
  };

  update = async (req: Request, res: Response) => {
    const result = validatePartialPerson(req.body);

    if (!result.success) {
      throw new ServerError({
        name: ErrorsName.UnprocessableEntityException,
        code: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: JSON.parse(result.error.message),
        logging: true,
      });
    }

    const { id } = req.params;

    const updatePerson = await this.personModel.update({
      ...result.data,
      personId: Number(id),
    });
    return res.json(updatePerson);
  };
}
