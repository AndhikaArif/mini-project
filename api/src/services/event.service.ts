import { PrismaClient } from "../generated/client.js";
import type { IEvent } from "../types/event.d.js";

const prisma = new PrismaClient();

export class EventService {
  async createEvent(
    {
      eventOrganizerId,
      name,
      category,
      location,
      price,
      totalSeats,
      availableSeats,
      startTime,
      endTime,
    }: IEvent,
    eoId: string
  ) {
    const user = await prisma.user.findFirst({
      where: { AND: { id: eoId, role: "EVENT_ORGANIZER" } },
    });

    if (!user) throw new Error("Event organizer not found");
    if (user.role !== "EVENT_ORGANIZER")
      throw new Error("Only Event Organizer can create event");

    const event = await prisma.event.create({
      data: {
        name,
        category,
        location,
        price,
        totalSeats,
        availableSeats,
        startTime,
        endTime,
        eventOrganizer: { connect: { id: eventOrganizerId } },
      },
    });

    return event;
  }

  async getAllEvents(page: number) {
    const limit = 8;

    const skip = (page - 1) * limit;

    const totalData = await prisma.event.count({
      where: { deletedAt: null },
    });
    const totalPages = Math.ceil(totalData / Number(limit));
    const events = await prisma.event.findMany({
      where: { deletedAt: null },
      select: {
        name: true,
        startTime: true,
        price: true,
        eventOrganizer: { select: { name: true } },
      },
      orderBy: { startTime: "asc" },
      skip,
      take: limit,
    });

    return {
      events,
      totalData,
      totalPages,
    };
  }

  async getEventById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        eventOrganizer: { select: { name: true } },
      },
    });

    return event;
  }

  async getTopThreeEvents() {
    const events = await prisma.event.findMany({
      where: { availableSeats: { gt: 0 } },
      orderBy: { availableSeats: "asc" },
      take: 3,
    });

    return events;
  }

  async getEventsByCategory(page: number) {
    const limit: number = 8;

    const skip = (page - 1) * limit;

    const totalData = await prisma.event.count();

    const totalPages = Math.ceil(totalData / limit);

    const events = await prisma.event.groupBy({
      by: ["category", "startTime"],
      orderBy: { startTime: "asc" },
      skip,
      take: limit,
    });

    return { events, totalData, totalPages };
  }

  async updateEvent(data: Partial<IEvent>, id: string) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) throw new Error("Event not found");

    const updatedEvent = await prisma.event.update({
      where: { id },
      data,
    });

    return updatedEvent;
  }

  async softDeleteEvent(id: string) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) throw new Error("Event not found");

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return updatedEvent;
  }
}

// belum menggunakan error handling
