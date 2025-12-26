import type { Request, Response, NextFunction } from "express";
import { TicketService } from "../services/ticket.service.js";
import { AppError } from "../errors/app.error.js";

const ticketService = new TicketService();

export class TicketController {
  async getMyTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.currentUser!.id;

      const tickets = await ticketService.getMyTickets(customerId);

      res.status(200).json(tickets);
    } catch (error) {
      next(error);
    }
  }

  async getTicketDetailById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      const customerId = req.currentUser!.id;

      if (!id) {
        throw new AppError(400, "Ticket id is required");
      }

      const ticket = await ticketService.getTicketDetailById(id, customerId);

      res.status(200).json(ticket);
    } catch (error) {
      next(error);
    }
  }
}
