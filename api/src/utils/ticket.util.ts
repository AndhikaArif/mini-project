import { prisma } from "../configs/prisma.config.js";
import { AppError } from "../errors/app.error.js";

type PrismaTx = Parameters<typeof prisma.$transaction>[0] extends (
  tx: infer T
) => any
  ? T
  : never;

export async function createTicketFromOrder(tx: PrismaTx, orderId: string) {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    include: { event: true },
  });

  if (!order) throw new AppError(404, "Order not found");

  const existing = await tx.ticket.findFirst({
    where: { orderId },
  });

  if (existing) return existing;

  const code = `${order.event.name.replace(/\s+/g, "-")}-${Math.floor(
    100000 + Math.random() * 900000
  )}`;

  return tx.ticket.create({
    data: {
      orderId,
      code,
      used: false,
    },
  });
}
