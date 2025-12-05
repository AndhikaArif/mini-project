import { type Request, type Response } from "express";
import { EventService } from "../services/event.service.js";

const eventService = new EventService();

export class EventController {
  async createEvent(req: Request, res: Response) {
    try {
      const {
        eventOrganizerId,
        venueId,
        categoryId,
        name,
        price,
        totalSeats,
        availableSeats,
        startTime,
        endTime,
      } = req.body;

      const event = await eventService.createEvent({
        name,
        categoryId,
        price,
        totalSeats,
        availableSeats,
        startTime,
        endTime,
        venueId,
        eventOrganizerId,
      });

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
      const id = String(req.params.id);

      if (!id) return res.status(400).json({ message: "Id is missing" });

      const event = await eventService.getEventById(id);
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to get event" });
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      if (!id) return res.status(400).json({ message: "Id is missing" });

      const updatedEvent = await eventService.updateEvent(req.body, id);

      res.status(201).json({ message: "Event has been updated", updatedEvent });
    } catch (error) {
      res.status(500).json({ message: "Failed to update event" });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      if (!id) return res.status(400).json({ message: "Id is missing" });

      const event = await eventService.softDeleteEvent(id);

      res.status(200).json({ message: "Event has been deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  }
}

// belum menggunakan error handling
