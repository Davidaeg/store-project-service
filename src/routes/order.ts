import { Router } from "express";
import { OrderController } from "../controllers/order";
import { OrdersModel } from "models/order/order";
import { AuthService } from "auth/auth.service";

export const createOrderRouter = ({
    orderModel,
  }: {
    orderModel: OrdersModel;
    authService: AuthService;
  }) => {
    const ordersRouter = Router();
  
    const ordersController = new OrderController(orderModel);
  
    //CRUD
    ordersRouter.get("/", ordersController.getAll);
    ordersRouter.get("/:id", ordersController.getById);
    ordersRouter.post("/", ordersController.create);
    ordersRouter.patch("/:id", ordersController.update);
  
    //OTHER REQUESTS
    ordersRouter.get("/search/:customerId", ordersController.findByCustomerId);

    //returning end points
    return ordersRouter;
  };