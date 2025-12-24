import cron from "node-cron";
import { prisma } from "../configs/prisma.config.js";
import { StatusPayment, StatusOrder } from "../generated/index.js";

export function startPaymentExpirationJob() {
  cron.schedule("*/5 * * * *", async () => {
    const expiredTime = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const payments = await prisma.payment.findMany({
      where: {
        status: StatusPayment.PENDING,
        createdAt: { lt: expiredTime },
      },
    });

    for (const payment of payments) {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: StatusPayment.EXPIRED },
        }),

        prisma.order.update({
          where: { id: payment.orderId },
          data: { status: StatusOrder.EXPIRED },
        }),
      ]);
    }

    if (payments.length > 0) {
      console.log(`[CRON] Expired ${payments.length} payments`);
    }
  });
}
