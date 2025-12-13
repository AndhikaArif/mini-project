import { PrismaClient } from "../generated/client.js";
import { type ICreateOrder } from "../types/order.d.js";

const prisma = new PrismaClient();

export class OrderService {
  async createOrder(data: ICreateOrder) {
    // customerId
    const user = await prisma.user.findFirst({
      where: { AND: { id: data.customerId, role: "CUSTOMER" } },
    });

    if (!user) throw new Error("User not found");
    if (user.role !== "CUSTOMER")
      throw new Error("Only customers are allowed to buy event tickets");

    // eventId
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
    });

    if (!event) throw new Error("Event not found");

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

    if (!user) throw new Error("User not found");
    if (user.role !== "CUSTOMER")
      throw new Error("Only customers can view order history");

    const orders = await prisma.order.findMany({ where: { customerId } });

    return orders;
  }

  async getAllEventOrders(userId: string, eventId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error("User not found");
    if (user.role !== "EVENT_ORGANIZER")
      throw new Error("Only Event Organizer can view order history");

    const event = await prisma.event.findFirst({
      where: { AND: { id: eventId, eventOrganizerId: userId } },
    });

    if (!event) throw new Error("Event not found");

    const orders = await prisma.order.findMany({ where: { eventId } });

    return orders;
  }

  async getOrderById(id: string, userId: string) {
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
