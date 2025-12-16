import { type Request, type Response } from "express";
import { OrderService } from "../services/order.service.js";

const orderService = new OrderService();

export class OrderController {
  async createOrder(req: Request, res: Response) {
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
      res.status(500).json({ message: "Failed to create order" });
    }
  }

  async getAllCustomerOrders(req: Request, res: Response) {
    try {
      const customerId = req.currentUser!.id;

      const orders = await orderService.getAllCustomerOrders(customerId);

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to show order history" });
    }
  }

  async getAllEventOrders(req: Request, res: Response) {
    try {
      const eoId = req.currentUser!.id;

      const eventId = String(req.params.id);

      const orders = await orderService.getAllEventOrders(eoId, eventId);

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to show order history" });
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const userId = req.currentUser!.id;
      const id = String(req.params.id);

      const order = await orderService.getOrderById(id, userId);

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to show order detail" });
    }
  }
}
