import { prisma } from "../configs/prisma.config.js";

export class OrganizerService {
  async getMyEvents(organizerId: string) {
    return prisma.event.findMany({
      where: {
        eventOrganizerId: organizerId,
        deletedAt: null,
      },
      include: {
        orders: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getTransactions(organizerId: string) {
    return prisma.order.findMany({
      where: {
        event: { eventOrganizerId: organizerId },
      },
      include: {
        event: { select: { name: true } },
        customer: { select: { name: true, email: true } },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getDashboardStats(organizerId: string) {
    const paidOrders = await prisma.order.findMany({
      where: {
        event: { eventOrganizerId: organizerId },
        status: "PAID",
      },
      select: {
        quantity: true,
        totalAmount: true,
      },
    });

    return {
      totalEvents: await prisma.event.count({
        where: { eventOrganizerId: organizerId, deletedAt: null },
      }),
      totalOrders: paidOrders.length,
      totalTicketsSold: paidOrders.reduce((a, b) => a + b.quantity, 0),
      totalRevenue: paidOrders.reduce((a, b) => a + b.totalAmount, 0),
    };
  }
}
