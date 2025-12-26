import { CategoryOption, Prisma } from "../generated/client.js";
import { type IEvent } from "../types/event.d.js";
import { FileUpload } from "../utils/file-upload.util.js";
import { AppError } from "../errors/app.error.js";
import { prisma } from "../configs/prisma.config.js";
import { type IEventSearch } from "../validations/event.validation.js";

const fileUpload = new FileUpload();

export class EventService {
  async createEvent(data: IEvent) {
    const user = await prisma.user.findUnique({
      where: { id: data.eventOrganizerId, role: "EVENT_ORGANIZER" },
    });

    if (!user) {
      throw new AppError(403, "Only Event Organizer can create event");
    }

    if (data.endTime <= data.startTime) {
      throw new AppError(400, "End time must be after start time");
    }

    if (data.totalSeats <= 0) {
      throw new AppError(400, "Total seats must be greater than 0");
    }

    const imageUrls = await fileUpload.uploadArray(data.eventImage);

    const event = await prisma.event.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        location: data.location,
        price: data.price,
        totalSeats: data.totalSeats,
        availableSeats: data.totalSeats,
        startTime: data.startTime,
        endTime: data.endTime,
        eventOrganizer: { connect: { id: data.eventOrganizerId } },

        eventImages: {
          create: imageUrls.map((url: string) => ({ url })),
        },
      },
      include: { eventImages: true },
    });

    return event;
  }

  async getAllEvents(query: IEventSearch) {
    const { page, limit, search, category, location, sortBy } = query;

    const skip = (page - 1) * limit;

    // Where Condition
    const where: Prisma.EventWhereInput = {
      deletedAt: null,
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
      ...(category && { category }),
      ...(location && { location }),
    };

    // Order By
    const orderByMap = {
      newest: { createdAt: "desc" },
      latest: { createdAt: "asc" },
      startTime: { startTime: "asc" },
    } as const;

    const orderBy: Prisma.EventOrderByWithRelationInput = orderByMap[sortBy];

    const totalData = await prisma.event.count({
      where,
    });

    const totalPages = Math.ceil(totalData / Number(limit));

    const events = await prisma.event.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        startTime: true,
        price: true,
        eventOrganizer: { select: { name: true } },
        eventImages: { take: 1, select: { url: true } },
      },
      orderBy,
      skip,
      take: limit,
    });

    return {
      data: events,
      meta: {
        page,
        limit,
        totalData,
        totalPages,
      },
    };
  }

  async getEventById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        eventOrganizer: { select: { name: true } },
        eventImages: { select: { url: true } },
      },
    });

    return event;
  }

  async getTopThreeEvents() {
    const events = await prisma.event.findMany({
      where: { availableSeats: { gt: 0 } },
      orderBy: { availableSeats: "asc" },
      select: {
        id: true,
        eventImages: { take: 1, select: { url: true } },
      },
      take: 3,
    });

    return events;
  }

  async getEventsByCategory(page: number, category: CategoryOption) {
    const limit: number = 8;

    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (category) {
      where.category = category;
    }

    const totalData = await prisma.event.count({ where });

    const totalPages = Math.ceil(totalData / limit);

    const events = await prisma.event.groupBy({
      where,
      by: ["category", "startTime"],
      orderBy: { startTime: "asc" },
      skip,
      take: limit,
    });

    return { events, totalData, totalPages };
  }

  async updateEvent(data: Partial<IEvent>, id: string, eoId: string) {
    const user = await prisma.user.findFirst({
      where: { AND: { id: eoId, role: "EVENT_ORGANIZER" } },
    });

    if (!user || user.role !== "EVENT_ORGANIZER") {
      throw new AppError(403, "Only Event Organizer can update event");
    }

    const event = await prisma.event.findUnique({
      where: { id, eventOrganizerId: eoId },
    });

    if (!event) throw new AppError(400, "Event not found");

    const updatedEvent = await prisma.event.update({
      where: { id, eventOrganizerId: eoId },
      data,
    });

    return updatedEvent;
  }

  async softDeleteEvent(id: string, eoId: string) {
    const user = await prisma.user.findFirst({
      where: { AND: { id: eoId, role: "EVENT_ORGANIZER" } },
    });

    if (!user || user.role !== "EVENT_ORGANIZER") {
      throw new AppError(403, "Only Event Organizer can update event");
    }

    const event = await prisma.event.findUnique({
      where: { id, eventOrganizerId: eoId },
    });

    if (!event) throw new AppError(400, "Event not found");

    const updatedEvent = await prisma.event.update({
      where: { id, eventOrganizerId: eoId },
      data: { deletedAt: new Date() },
    });

    return updatedEvent;
  }
}
