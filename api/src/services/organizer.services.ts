import { prisma } from "../configs/prisma.config.js";
import { AppError } from "../errors/app.error.js";
import type { UpdateEventDTO } from "../validations/event.validation.js";
import { StatusPayment, StatusOrder } from "../generated/index.js";

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
    return prisma.payment.findMany({
      where: {
        order: {
          event: {
            eventOrganizerId: organizerId,
          },
        },
      },
      include: {
        order: {
          select: {
            quantity: true,
            totalAmount: true,
            createdAt: true,
            event: {
              select: { name: true },
            },
            customer: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
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

  async updateEvent(
    eventId: string,
    organizerId: string,
    data: UpdateEventDTO
  ) {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        eventOrganizerId: organizerId,
      },
    });

    if (!event) {
      throw new AppError(404, "Event not found");
    }

    const prismaData: Parameters<typeof prisma.event.update>[0]["data"] = {};

    if (data.name !== undefined) {
      prismaData.name = data.name;
    }

    if (data.price !== undefined) {
      prismaData.price = data.price;
    }

    if (data.totalSeats !== undefined) {
      const soldSeats = event.totalSeats - event.availableSeats;

      if (data.totalSeats < soldSeats) {
        throw new AppError(
          400,
          `Total seats cannot be less than sold seats (${soldSeats})`
        );
      }

      prismaData.totalSeats = data.totalSeats;
      prismaData.availableSeats = data.totalSeats - soldSeats;
    }

    if (data.startTime !== undefined) {
      prismaData.startTime = new Date(data.startTime);
    }

    if (data.endTime !== undefined) {
      prismaData.endTime = new Date(data.endTime);
    }

    return prisma.event.update({
      where: { id: eventId },
      data: prismaData,
    });
  }

  async updatePaymentStatus(
    organizerId: string,
    paymentId: string,
    status: StatusPayment
  ) {
    if (status !== StatusPayment.DONE && status !== StatusPayment.REJECTED) {
      throw new AppError(400, "Invalid payment status action");
    }

    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        order: {
          event: { eventOrganizerId: organizerId },
        },
      },
      include: {
        order: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!payment) {
      throw new AppError(404, "Payment not found");
    }

    if (payment.status !== StatusPayment.WAITING_CONFIRMATION) {
      throw new AppError(400, "Payment is not waiting for confirmation");
    }

    return prisma.$transaction(async (tx) => {
      // 1️⃣ Update payment
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status,
          paidAt: status === StatusPayment.DONE ? new Date() : null,
        },
      });

      // 2️⃣ Update order
      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status:
            status === StatusPayment.DONE
              ? StatusOrder.PAID
              : StatusOrder.WAITING_PAYMENT,
          verifiedAt: status === StatusPayment.DONE ? new Date() : null,
        },
      });

      // 3️⃣ KURANGI SEATS JIKA APPROVED
      if (status === StatusPayment.DONE) {
        const event = payment.order.event;

        if (event.availableSeats < payment.order.quantity) {
          throw new AppError(400, "Not enough available seats");
        }

        await tx.event.update({
          where: { id: event.id },
          data: {
            availableSeats: {
              decrement: payment.order.quantity,
            },
          },
        });
      }
    });
  }

  async getEventAttendees(organizerId: string, eventId: string) {
    // 1️⃣ Validasi event milik organizer
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        eventOrganizerId: organizerId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!event) {
      throw new AppError(404, "Event not found");
    }

    // 2️⃣ Ambil attendee (PAID orders)
    const attendees = await prisma.order.findMany({
      where: {
        eventId,
        status: StatusOrder.PAID,
      },
      select: {
        quantity: true,
        totalAmount: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 3️⃣ Optional: summary
    const summary = {
      totalAttendees: attendees.length,
      totalTicketsSold: attendees.reduce((a, b) => a + b.quantity, 0),
      totalRevenue: attendees.reduce((a, b) => a + b.totalAmount, 0),
    };

    return {
      event,
      summary,
      attendees: attendees.map((a) => ({
        name: a.customer.name,
        email: a.customer.email,
        quantity: a.quantity,
        totalPaid: a.totalAmount,
      })),
    };
  }

  async cancelEvent(eventId: string, organizerId: string) {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        eventOrganizerId: organizerId,
        deletedAt: null,
      },
    });

    if (!event) {
      throw new AppError(404, "Event not found");
    }

    return prisma.$transaction([
      // 1️⃣ Soft delete event
      prisma.event.update({
        where: { id: eventId },
        data: {
          deletedAt: new Date(),
        },
      }),

      // 2️⃣ Cancel orders
      prisma.order.updateMany({
        where: {
          eventId,
          status: {
            in: [StatusOrder.WAITING_PAYMENT, StatusOrder.PAID],
          },
        },
        data: {
          status: StatusOrder.CANCELLED,
        },
      }),

      // 3️⃣ Cancel payments
      prisma.payment.updateMany({
        where: {
          order: {
            eventId,
          },
          status: {
            in: [StatusPayment.PENDING, StatusPayment.WAITING_CONFIRMATION],
          },
        },
        data: {
          status: StatusPayment.CANCELLED,
        },
      }),
    ]);
  }
}
