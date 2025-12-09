import { PrismaClient } from "../generated/client.js";
import type { IEvent } from "../types/event.js";

const prisma = new PrismaClient();

export class EventService {
  async createEvent({
    eventOrganizerId,
    venueId,
    categoryId,
    name,
    price,
    totalSeats,
    availableSeats,
    startTime,
    endTime,
  }: IEvent) {
    const event = await prisma.event.create({
      data: {
        name,
        category: { connect: { id: categoryId } },
        price,
        totalSeats,
        availableSeats,
        startTime,
        endTime,
        venue: { connect: { id: venueId } },
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
        category: { select: { name: true } },
        eventOrganizer: { select: { name: true } },
        venue: { select: { name: true } },
      },
    });

    return event;
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
