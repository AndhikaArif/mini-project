import { OrganizerService } from "../services/organizer.services.js";
import type { Request, Response, NextFunction } from "express";
import { updateEventSchema } from "../validations/event.validation.js";

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

  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.currentUser!.id;
      const { id } = req.params;

      await organizerService.deleteEvent(id!, organizerId);

      res.json({ message: "Event deleted" });
    } catch (err) {
      next(err);
    }
  }
}
