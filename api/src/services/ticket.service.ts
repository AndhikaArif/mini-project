import { prisma } from "../configs/prisma.config.js";
import { AppError } from "../errors/app.error.js";

export class TicketService {
  async getMyTickets(customerId: string) {
    const tickets = await prisma.ticket.findMany({
      where: { order: { customerId } },
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          include: {
            event: { select: { name: true, startTime: true, location: true } },
          },
        },
      },
    });

    return tickets;
  }

  async getTicketDetailById(id: string, customerId: string) {
    const ticket = await prisma.ticket.findFirst({
      where: { id, order: { customerId } },
      include: {
        order: {
          include: {
            event: { select: { name: true, startTime: true, location: true } },
          },
        },
      },
    });

    if (!ticket) {
      throw new AppError(404, "Ticket not found");
    }

    return ticket;
  }
}
