import { prisma } from "../configs/prisma.config.js";
import { StatusPayment, StatusOrder } from "../generated/index.js";

export async function expirePayments() {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

  const payments = await prisma.payment.findMany({
    where: {
      status: StatusPayment.PENDING,
      paymentProof: null,
      createdAt: {
        lte: twoHoursAgo,
      },
    },
  });

  if (!payments.length) return;

  await prisma.$transaction([
    prisma.payment.updateMany({
      where: {
        id: { in: payments.map((p) => p.id) },
      },
      data: {
        status: StatusPayment.EXPIRED,
      },
    }),

    prisma.order.updateMany({
      where: {
        id: { in: payments.map((p) => p.orderId) },
      },
      data: {
        status: StatusOrder.EXPIRED,
      },
    }),
  ]);
}
