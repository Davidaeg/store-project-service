import { Request, Response } from "express";
import { ColorModel } from "../models/color/color";
import { validatePartialColor, validateColor } from "../schemas/color";
import ServerError from "@errors/ServerError";
import { ErrorsName, HTTP_STATUS } from "@errors/error.enum";

export class ColorController {
  constructor(private colorModel: ColorModel) {}

  getAll = async (_req: Request, res: Response) => {
    const colors = await this.colorModel.getAll();
    res.json(colors);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const color = await this.colorModel.getById({ id: Number(id) });
    if (color) return res.json(color);
    throw new ServerError({
      name: ErrorsName.NotFoundException,
      code: HTTP_STATUS.NOT_FOUND,
      message: "Color not found",
      logging: true,
    });
  };

  create = async (req: Request, res: Response) => {
    const result = validateColor(req.body);

    if (!result.success) {
      throw new ServerError({
        name: ErrorsName.UnprocessableEntityException,
        code: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: JSON.parse(result.error.message),
        logging: true,
      });
    }

    const newProduct = await this.colorModel.create(result.data);

    res.status(201).json(newProduct);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await this.colorModel.delete({ id: Number(id) });

    if (result === false) {
      throw new ServerError({
        name: ErrorsName.NotFoundException,
        code: HTTP_STATUS.NOT_FOUND,
        message: "Color not found",
        logging: true,
      });
    }

    return res.json({ message: "Color deleted" });
  };

  update = async (req: Request, res: Response) => {
    const result = validatePartialColor(req.body);

    if (!result.success) {
      throw new ServerError({
        name: ErrorsName.UnprocessableEntityException,
        code: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: JSON.parse(result.error.message),
        logging: true,
      });
    }

    const { id } = req.params;

    const updatedColor = await this.colorModel.update({
      ...result.data,
      colorId: Number(id),
    });
    return res.json(updatedColor);
  };

  getProductColors = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const colors = await this.colorModel.getProductColors({ productId: Number(productId) });
    res.json(colors);
  };
}
