import { CategoryOption, Prisma } from "../generated/client.js";
import { type IEvent, type IEventSearch } from "../types/event.d.js";
import { FileUpload } from "../utils/file-upload.util.js";
import { AppError } from "../errors/app.error.js";
import { prisma } from "../configs/prisma.config.js";

const fileUpload = new FileUpload();

export class EventService {
  async createEvent({
    eventOrganizerId,
    name,
    description,
    category,
    location,
    price,
    totalSeats,
    availableSeats,
    startTime,
    endTime,
    eventImage,
  }: IEvent) {
    const user = await prisma.user.findFirst({
      where: { AND: { id: eventOrganizerId, role: "EVENT_ORGANIZER" } },
    });

    if (!user) throw new AppError(400, "Event organizer not found");
    if (user.role !== "EVENT_ORGANIZER")
      throw new AppError(400, "Only Event Organizer can create event");

    const imageUrls = await fileUpload.uploadArray(eventImage);

    const event = await prisma.event.create({
      data: {
        name,
        description,
        category,
        location,
        price,
        totalSeats,
        availableSeats,
        startTime,
        endTime,
        eventOrganizer: { connect: { id: eventOrganizerId } },

        eventImages: {
          create: imageUrls.map((url: string) => ({ url })),
        },
      },
      include: { eventImages: true },
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
        id: true,
        name: true,
        description: true,
        startTime: true,
        price: true,
        eventOrganizer: { select: { name: true } },
        eventImages: { take: 1, select: { url: true } },
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

  async eventsSearch(query: IEventSearch) {
    const { page = 1, limit = 8, search, category, location, sortBy } = query;

    const where: Prisma.EventWhereInput = {
      AND: [
        search ? { name: { contains: search, mode: "insensitive" } } : {},
        category ? { category } : {},
        location ? { location } : {},
      ],
    };

    const orderBy: Prisma.EventOrderByWithRelationInput =
      sortBy === "newest" ? { createdAt: "desc" } : { createdAt: "asc" };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return {
      data: events,
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }
}
