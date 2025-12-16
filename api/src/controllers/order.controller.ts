import { type Request, type Response, type NextFunction } from "express";
import { OrderService } from "../services/order.service.js";

const orderService = new OrderService();

export class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId, quantity } = req.body;
      const customerId = req.currentUser!.id;

      const order = await orderService.createOrder({
        eventId,
        quantity,
        customerId,
      });

      res.status(201).json({ message: "Success create order", order });
    } catch (error) {
      next(error);
    }
  }

  async getAllCustomerOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.currentUser!.id;

      const orders = await orderService.getAllCustomerOrders(customerId);

      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getAllEventOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const eventOrganizerId = req.currentUser!.id;

      const eventId = String(req.params.id);

      const orders = await orderService.getAllEventOrders(
        eventOrganizerId,
        eventId
      );

      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.currentUser!.id;
      const id = String(req.params.id);

      const order = await orderService.getOrderById(id, userId);

      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
}
