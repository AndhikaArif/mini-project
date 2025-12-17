import { OrganizerService } from "../services/organizer.services.js";
import type { Request, Response, NextFunction } from "express";

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
}
