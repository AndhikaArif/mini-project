import { PrismaClient } from "../generated/index.js";
import {
  type ICreatePayment,
  type IUpdatePayment,
} from "../types/payment.d.js";

const prisma = new PrismaClient();

export class PaymentService {
  async createPayment(data: ICreatePayment) {
    // orderId
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!order) throw new Error("Order not found");

    // voucherId
    const voucher = await prisma.voucher.findFirst({
      where: { AND: { eventId: order.eventId, customerId: order.customerId } },
    });

    if (!voucher) throw new Error("Voucher not found");

    // couponId
    const coupon = await prisma.coupon.findFirst({
      where: { userId: order.customerId },
    });

    if (!coupon) throw new Error("You dont have any coupon");

    data.totalPaid = order.totalAmount - (voucher.value + coupon.discount);

    const payment = await prisma.payment.create({ data });
  }

  async getAllPayment(eoId: string, eventId: string) {
    const user = await prisma.user.findFirst({
      where: { AND: { id: eoId, role: "EVENT_ORGANIZER" } },
    });

    if (!user) throw new Error("User not found");
    if (user.role !== "EVENT_ORGANIZER")
      throw new Error("Only EO can access this page");

    const payments = await prisma.payment.findMany({
      where: {
        AND: { order: { event: { eventOrganizerId: eoId, id: eventId } } },
      },
    });

    return payments;
  }

  async getPaymentById(id: string, userId: string) {
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

    const order = await prisma.order.findUnique({
      where: { id: payment!.orderId },
    });

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
