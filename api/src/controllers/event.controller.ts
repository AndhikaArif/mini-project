import { type Request, type Response } from "express";
import { EventService } from "../services/event.service.js";
import { fi } from "@faker-js/faker";
import type { CategoryOption, LocationOption } from "../generated/index.js";

const eventService = new EventService();

export class EventController {
  async createEvent(req: Request, res: Response) {
    try {
      const {
        eventOrganizerId,
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

      const event = await eventService.createEvent(
        {
          name,
          category,
          location,
          price,
          totalSeats,
          availableSeats,
          startTime,
          endTime,
          eventOrganizerId,
          eventImage,
        },
        user
      );

      res.status(201).json({ message: "Event has been created", event });
    } catch (error) {
      res.status(500).json({ message: "Failed to create event" });
    }
  }

  async getAllEvents(req: Request, res: Response) {
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
      res.status(500).json({ message: "Failed to get all events" });
    }
  }

  async getEventById(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (!id) return res.status(400).json({ message: "Id is missing" });

      const event = await eventService.getEventById(id);
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to get event" });
    }
  }

  async getTopThreeEvents(req: Request, res: Response) {
    try {
      const events = await eventService.getTopThreeEvents();

      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to get top three events" });
    }
  }

  async getEventsByCategory(req: Request, res: Response) {
    try {
      let page = Number(req.query.page);
      if (!page || page < 1) page = 1;

      const { events, totalData, totalPages } =
        await eventService.getEventsByCategory(page);

      res.status(200).json({ events, totalData, totalPages });
    } catch (error) {
      res.status(500).json({ message: "Failed to get events" });
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const eoId = req.currentUser!.id;

      if (!id) return res.status(400).json({ message: "Id is missing" });

      const updatedEvent = await eventService.updateEvent(req.body, id, eoId);

      res.status(201).json({ message: "Event has been updated", updatedEvent });
    } catch (error) {
      res.status(500).json({ message: "Failed to update event" });
    }
  }

  async softDeleteEvent(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const eoId = req.currentUser!.id;

      if (!id) return res.status(400).json({ message: "Id is missing" });

      const event = await eventService.softDeleteEvent(id, eoId);

      res.status(200).json({ message: "Event has been deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  }

  async eventSearch(req: Request, res: Response) {
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
      res.status(500).json({ message: "Failed to search event" });
    }
  }
}
