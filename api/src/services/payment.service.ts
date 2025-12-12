import { PrismaClient } from "../generated/index.js";
import type { IUpdatePayment } from "../types/payment.js";

const prisma = new PrismaClient();

export class PaymentService {
  async createPayment(orderId: string) {
    const payment = await prisma.payment.create({ data: { orderId } });
  }

  async getAllPayment(eoId: string) {
    const user = await prisma.user.findFirst({
      where: { AND: { id: eoId, role: "EVENT_ORGANIZER" } },
    });

    if (!user) throw new Error("User not found");
    if (user.role !== "EVENT_ORGANIZER")
      throw new Error("Only EO can access this page");

    const payments = await prisma.payment.findMany({
      where: { order: { event: { eventOrganizerId: eoId } } },
    });

    return payments;
  }

  async getPaymentById(id: string, userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    const payment = await prisma.payment.findFirst({
      where: {
        AND: {
          id,
          OR: [
            {
              order: { customerId: userId },
            },
            { order: { event: { eventOrganizerId: userId } } },
          ],
        },
      },
    });

    return payment;
  }

  async updatePayment(data: IUpdatePayment, id: string, userId: string) {
    const payment = await prisma.payment.findFirst({
      where: {
        AND: {
          id,
          OR: [
            {
              order: { customerId: userId },
            },
            { order: { event: { eventOrganizerId: userId } } },
          ],
        },
      },
    });

    const order = await prisma.order.findFirst({ where: { id } });

    let statusOrder = order?.status;
    if (payment?.status == "EXPIRED") {
      statusOrder = "EXPIRED";
    }
    if (payment?.status == "REJECTED") {
      statusOrder = "REJECTED";
    }
    if (payment?.status == "DONE") {
      statusOrder = "PAID";
    }

    let verifiedAt = order?.verifiedAt;
    if (payment?.status == "DONE") {
      verifiedAt = new Date();
    } else {
      verifiedAt = null;
    }

    let paidAt = payment?.paidAt;
    if (payment?.status == "DONE") {
      paidAt = new Date();
    } else {
      paidAt = null;
    }

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data,
    });

    return updatedPayment;
  }
}
