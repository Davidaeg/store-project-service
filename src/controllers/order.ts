import { Request, Response } from "express";
import { OrdersModel } from "../models/order/order";
import { validateOrder, validatePartialOrder } from "../schemas/order";
import ServerError from "@errors/ServerError";
import { ErrorsName, HTTP_STATUS } from "@errors/error.enum";

export class OrderController{
    constructor(private orderModel: OrdersModel) {}

    getById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const order = await this.orderModel.getById({ id: Number(id) });
        if (order) return res.json(order);
        throw new ServerError({
          name: ErrorsName.NotFoundException,
          code: HTTP_STATUS.NOT_FOUND,
          message: "Order not found",
          logging: true,
        });
      };

    getAll = async (_req: Request, res: Response) => {
        const orders = await this.orderModel.getAll();
        res.json(orders);
    };

    create = async (req: Request, res: Response) => {
        const result = validateOrder(req.body);

        if (!result.success) {
            throw new ServerError({
              name: ErrorsName.UnprocessableEntityException,
              code: HTTP_STATUS.UNPROCESSABLE_ENTITY,
              message: JSON.parse(result.error.message),
              logging: true,
            });
          }

          const newOrder = await this.orderModel.create(result.data);

          res.status(201).json(newOrder);
    }

    findByCustomerId = async (req: Request, res: Response) => {
        const { customerId } = req.params;
        const orders = await this.orderModel.findByCustomerId({ customerId: Number(customerId) });
        res.json(orders);
    };

    update = async (req: Request, res: Response) => {
      const result = validatePartialOrder(req.body);

      if (!result.success) {
        throw new ServerError({
          name: ErrorsName.UnprocessableEntityException,
          code: HTTP_STATUS.UNPROCESSABLE_ENTITY,
          message: JSON.parse(result.error.message),
          logging: true,
        });
      }

      const { id } = req.params;
      
      const updatedOrder = await this.orderModel.update({
        ...result.data,
        orderId: Number(id),
      });
      return res.json(updatedOrder);
    };
}