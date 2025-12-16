import { AppError } from "../errors/app.error.js";
import {
  PrismaClient,
  StatusPayment,
  StatusOrder,
} from "../generated/index.js";
import {
  type ICreatePayment,
  type IUpdatePaymentProof,
  type IUpdatePaymentStatus,
} from "../types/payment.d.js";
import { FileUpload } from "../utils/file-upload.util.js";

const fileUpload = new FileUpload();

const prisma = new PrismaClient();

export class PaymentService {
  async createPayment(data: ICreatePayment) {
    // orderId
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!order) throw new AppError(404, "Order not found");

    // voucherId
    let voucher;
    if (data.voucherId) {
      voucher = await prisma.voucher.findUnique({
        where: { id: data.voucherId },
      });
    }

    // couponId
    let coupon;
    if (data.couponId) {
      coupon = await prisma.coupon.findUnique({
        where: { id: data.couponId, userId: order.customerId },
      });
    }

    const voucherValue = voucher?.value ?? 0;
    const couponDiscount = coupon?.discount ?? 0;

    data.totalPaid = order.totalAmount - voucherValue - couponDiscount;

    const payment = await prisma.payment.create({ data });

    return payment;
  }

  async getAllPayment(eoId: string, eventId: string) {
    const user = await prisma.user.findUnique({
      where: { id: eoId, role: "EVENT_ORGANIZER" },
    });

    if (!user || user.role !== "EVENT_ORGANIZER")
      throw new AppError(403, "Only Event Organizer can access this page");

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

  async updatePaymentProof(data: IUpdatePaymentProof) {
    const payment = await prisma.payment.findFirst({
      where: { AND: { id: data.id, order: { customerId: data.customerId } } },
    });

    if (!payment) {
      throw new AppError(404, "Payment not found or forbidden");
    }

    if (payment.status !== "PENDING") {
      throw new AppError(
        400,
        "Payment proof can only be uploaded for pending payments"
      );
    }

    const imageUrl = await fileUpload.uploadSingle(data.paymentProof.path);

    const updatedPayment = await prisma.payment.update({
      where: { id: data.id },
      data: {
        paymentProof: imageUrl,
        status: "WAITING_CONFIRMATION",
      },
    });

    return updatedPayment;
  }

  async updatePaymentStatus(data: IUpdatePaymentStatus) {
    const payment = await prisma.payment.findFirst({
      where: {
        AND: { id: data.id, order: { event: { eventOrganizerId: data.eoId } } },
      },
    });

    if (!payment) {
      throw new AppError(404, "Payment not found or forbidden");
    }

    if (payment.status !== "WAITING_CONFIRMATION") {
      throw new AppError(
        400,
        "Payment status can only be changed after customer uploaded payment proof"
      );
    }

    const now = new Date();

    function mapPaymentStatusToOrderStatus(
      paymentStatus: StatusPayment
    ): StatusOrder {
      switch (paymentStatus) {
        case "DONE":
          return "PAID";

        case "REJECTED":
          return "REJECTED";

        case "EXPIRED":
          return "EXPIRED";

        case "PENDING":
        case "WAITING_CONFIRMATION":
        case "CANCELLED":
        default:
          return "WAITING_PAYMENT";
      }
    }

    const orderStatus = mapPaymentStatusToOrderStatus(data.status);

    const [updatedPayment, updatedOrder] = await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: data.status,
          paidAt: data.status === "DONE" ? now : null,
        },
      }),

      prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: orderStatus,
          verifiedAt: now,
        },
      }),
    ]);

    return {
      payment: updatedPayment,
      order: updatedOrder,
    };
  }

  // async updatePayment(data: IUpdatePaymentStatus) {
  //   const payment = await prisma.payment.findFirst({
  //     where: {
  //       AND: {
  //         id: data.paymentId,
  //         OR: [
  //           {
  //             order: { customerId: data.userId },
  //           },
  //           { order: { event: { eventOrganizerId: data.userId } } },
  //         ],
  //       },
  //     },
  //   });

  //   if (!payment) {
  //     throw new AppError(404, "Payment not found or forbidden");
  //   }

  //   const imageUrls = await fileUpload.uploadSingle(data.paymentProof.path);

  //   const order = await prisma.order.findUnique({
  //     where: { id: payment!.orderId },
  //   });

  //   let statusOrder = order?.status;
  //   if (data.status == "EXPIRED") {
  //     statusOrder = "EXPIRED";
  //   }
  //   if (data.status == "REJECTED") {
  //     statusOrder = "REJECTED";
  //   }
  //   if (data.status == "DONE") {
  //     statusOrder = "PAID";
  //   }

  //   let verifiedAt = order?.verifiedAt;
  //   if (payment?.status == "DONE") {
  //     verifiedAt = new Date();
  //   } else {
  //     verifiedAt = null;
  //   }

  //   let paidAt = payment?.paidAt;
  //   if (payment?.status == "DONE") {
  //     paidAt = new Date();
  //   } else {
  //     paidAt = null;
  //   }

  //   const updatedPayment = await prisma.payment.update({
  //     where: { id: data.paymentId },
  //     data: { ...data, paidAt, paymentProof: imageUrls },
  //   });

  //   await prisma.order.update({
  //     where: { id: payment.orderId },
  //     data: {
  //       status: statusOrder!,
  //       verifiedAt,
  //     },
  //   });

  //   return updatedPayment;
  // }
}
