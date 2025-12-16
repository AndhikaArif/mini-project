import { type Request, type Response } from "express";
import { PaymentService } from "../services/payment.service.js";
import type { IUpdatePayment } from "../types/payment.d.js";

const paymentService = new PaymentService();

export class PaymentController {
  async createPayment(req: Request, res: Response) {
    try {
      const orderId = req.body;

      const payment = await paymentService.createPayment(orderId);

      res.status(201).json({ message: "Success to create payment", payment });
    } catch (error) {
      res.status(500).json({ message: "Failed to create payment" });
    }
  }

  async getAllPayment(req: Request, res: Response) {
    try {
      const eoId = req.currentUser!.id;
      const eventId = String(req.params.id);

      const payments = await paymentService.getAllPayment(eoId, eventId);

      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get all payments" });
    }
  }

  async getPaymentById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const userId = req.currentUser!.id;

      const payment = await paymentService.getPaymentById(id, userId);

      res.status(200).json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to get payment" });
    }
  }

  async updatePayment(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const userId = req.currentUser!.id;

      const data: IUpdatePayment = req.body;

      const updatedPayment = await paymentService.updatePayment(
        data,
        id,
        userId
      );

      res
        .status(200)
        .json({ message: "Success update payment", updatedPayment });
    } catch (error) {
      res.status(500).json({ message: "Failed to update payment" });
    }
  }
}
