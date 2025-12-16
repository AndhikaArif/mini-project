import { type Request, type Response, type NextFunction } from "express";
import { PaymentService } from "../services/payment.service.js";
import { AppError } from "../errors/app.error.js";
import { StatusPayment } from "../generated/index.js";

const paymentService = new PaymentService();

export class PaymentController {
  async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.body;

      const payment = await paymentService.createPayment(orderId);

      res.status(201).json({ message: "Success to create payment", payment });
    } catch (error) {
      next(error);
    }
  }

  async getAllPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const eoId = req.currentUser!.id;
      const eventId = String(req.params.id);

      const payments = await paymentService.getAllPayment(eoId, eventId);

      res.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  }

  async getPaymentById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const userId = req.currentUser!.id;

      const payment = await paymentService.getPaymentById(id, userId);

      res.status(200).json(payment);
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentProof(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const customerId = req.currentUser!.id;

      const paymentProof = req.file as Express.Multer.File;

      if (!paymentProof) throw new AppError(400, "File missing");

      const updatedPayment = await paymentService.updatePaymentProof({
        id,
        paymentProof,
        customerId,
      });

      res
        .status(200)
        .json({ message: "Success upload payment proof", updatedPayment });
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const eoId = req.currentUser!.id;

      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const allowedStatus: StatusPayment[] = ["EXPIRED", "REJECTED", "DONE"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid payment status",
        });
      }

      const updatedPayment = await paymentService.updatePaymentStatus({
        id,
        eoId,
        status,
      });

      res
        .status(200)
        .json({ message: "Success update payment", updatedPayment });
    } catch (error) {
      next(error);
    }
  }
}
