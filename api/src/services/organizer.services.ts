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
        createdAt: true,
      },
    });

    // ---------- SUMMARY ----------
    const summary = {
      totalEvents: await prisma.event.count({
        where: { eventOrganizerId: organizerId, deletedAt: null },
      }),

      totalOrders: paidOrders.length,
      totalTicketsSold: paidOrders.reduce((a, b) => a + b.quantity, 0),
      totalRevenue: paidOrders.reduce((a, b) => a + b.totalAmount, 0),
    };

    // ---------- HELPER GROUPING ----------
    const groupBy = (keyFn: (date: Date) => string) => {
      const map = new Map<string, { revenue: number; orders: number }>();

      for (const order of paidOrders) {
        const key = keyFn(order.createdAt);
        const current = map.get(key) || { revenue: 0, orders: 0 };

        current.revenue += order.totalAmount;
        current.orders += 1;

        map.set(key, current);
      }

      return Array.from(map.entries()).map(([label, value]) => ({
        label,
        ...value,
      }));
    };

    // ---------- GROUPING ----------
    const byYear = groupBy((date) => date.getFullYear().toString());

    const byMonth = groupBy(
      (date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    );

    const byDay = groupBy((date) => date.toISOString().slice(0, 10));

    return {
      summary,
      stats: {
        byYear,
        byMonth,
        byDay,
      },
    };
  }
}
