import { OrganizerService } from "../services/organizer.services.js";
import type { Request, Response, NextFunction } from "express";
import { updateEventSchema } from "../validations/event.validation.js";
import { AppError } from "../errors/app.error.js";
import { StatusPayment } from "../generated/index.js";

const organizerService = new OrganizerService();

export class OrganizerController {
  async getMyEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.currentUser!.id;

      const result = await organizerService.getMyEvents(organizerId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.currentUser!.id;

      const result = await organizerService.getTransactions(organizerId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.currentUser!.id;

      const result = await organizerService.getDashboardStats(organizerId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.currentUser!.id;
      const { id } = req.params;

      const data = updateEventSchema.parse(req.body);

      const updated = await organizerService.updateEvent(
        id!,
        organizerId,
        data
      );

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.currentUser!.id;
      const { id } = req.params;
      const { status } = req.body;

      // ---------- VALIDATION ----------
      if (!id) {
        throw new AppError(400, "Payment id is required");
      }

      if (status !== StatusPayment.DONE && status !== StatusPayment.REJECTED) {
        throw new AppError(400, "Status must be DONE or REJECTED");
      }

      // ---------- SERVICE ----------
      const result = await organizerService.updatePaymentStatus(
        organizerId,
        id,
        status
      );

      res.status(200).json({
        message:
          status === StatusPayment.DONE
            ? "Payment approved"
            : "Payment rejected",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.currentUser!.id;
      const { id } = req.params;

      await organizerService.cancelEvent(id!, organizerId);

      res.json({ message: "Event cancelled successfully" });
    } catch (error) {
      next(error);
    }
  }
}
