import { type Request, type Response, type NextFunction } from "express";
import { EventService } from "../services/event.service.js";
import type { CategoryOption, LocationOption } from "../generated/index.js";

const eventService = new EventService();

export class EventController {
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        category,
        location,
        price,
        totalSeats,
        availableSeats,
        startTime,
        endTime,
      } = req.body;

      const eventImage = req.files as Express.Multer.File[];

      const user = req.currentUser!.id;

      const event = await eventService.createEvent({
        name,
        category,
        location,
        price: parseFloat(price),
        totalSeats: +totalSeats,
        availableSeats: Number(availableSeats),
        startTime,
        endTime,
        eventOrganizerId: user,
        eventImage,
      });

      res.status(201).json({ message: "Event has been created", event });
    } catch (error) {
      next(error);
    }
  }

  async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      let page = Number(req.query.page);
      if (!page || page < 1) page = 1;

      const { events, totalData, totalPages } = await eventService.getAllEvents(
        page
      );
      res
        .status(200)
        .json({ data: events, totalData, totalPages, currentPage: +page });
    } catch (error) {
      next(error);
    }
  }

  async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (!id) return res.status(400).json({ message: "Id is missing" });

      const event = await eventService.getEventById(id);
      res.status(200).json(event);
    } catch (error) {
      next(error);
    }
  }

  async getTopThreeEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await eventService.getTopThreeEvents();

      res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  }

  async getEventsByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      let page = Number(req.query.page);
      if (!page || page < 1) page = 1;

      const { events, totalData, totalPages } =
        await eventService.getEventsByCategory(page);

      res.status(200).json({ events, totalData, totalPages });
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const eoId = req.currentUser!.id;
      const data = req.body;

      if (!id) return res.status(400).json({ message: "Id is missing" });

      const updatedEvent = await eventService.updateEvent(data, id, eoId);

      res.status(201).json({ message: "Event has been updated", updatedEvent });
    } catch (error) {
      next(error);
    }
  }

  async softDeleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const eoId = req.currentUser!.id;

      if (!id) return res.status(400).json({ message: "Id is missing" });

      const event = await eventService.softDeleteEvent(id, eoId);

      res.status(200).json({ message: "Event has been deleted" });
    } catch (error) {
      next(error);
    }
  }

  async eventSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await eventService.eventsSearch({
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        search: req.query.search as string,
        category: req.query.category as CategoryOption,
        location: req.query.location as LocationOption,
        sortBy: req.query.sortBy as any,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
