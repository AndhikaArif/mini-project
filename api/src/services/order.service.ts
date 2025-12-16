import { AppError } from "../errors/app.error.js";
import { PrismaClient } from "../generated/client.js";
import { type ICreateOrder } from "../types/order.d.js";

const prisma = new PrismaClient();

export class OrderService {
  async createOrder(data: ICreateOrder) {
    // customerId
    const user = await prisma.user.findUnique({
      where: { id: data.customerId, role: "CUSTOMER" },
    });

    if (!user || user.role !== "CUSTOMER")
      throw new AppError(
        403,
        "Only customers are allowed to buy event tickets"
      );

    // eventId
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
    });

    if (!event) throw new AppError(40, "Event not found");

    const totalAmount = data.quantity * event!.price;

    const order = await prisma.order.create({
      data: { ...data, totalAmount },
    });

    return order;
  }

  async getAllCustomerOrders(customerId: string) {
    const user = await prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!user || user.role !== "CUSTOMER")
      throw new AppError(403, "Only customers can view order history");

    const orders = await prisma.order.findMany({ where: { customerId } });

    return orders;
  }

  async getAllEventOrders(eoId: string, eventId: string) {
    const user = await prisma.user.findUnique({
      where: { id: eoId },
    });

    if (!user || user.role !== "EVENT_ORGANIZER")
      throw new AppError(403, "Only Event Organizer can view order history");

    const event = await prisma.event.findUnique({
      where: { id: eventId, eventOrganizerId: eoId },
    });

    if (!event) throw new AppError(404, "Event not found");

    const orders = await prisma.order.findMany({ where: { eventId } });

    return orders;
  }

  async getOrderById(id: string, userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new AppError(404, "User not found");

    const order = await prisma.order.findFirst({
      where: {
        AND: [
          {
            id,
            OR: [
              { customerId: userId },
              { event: { eventOrganizerId: userId } },
            ],
          },
        ],
      },
    });

    return order;
  }
}
