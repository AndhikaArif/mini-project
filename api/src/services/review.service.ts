import { prisma } from "../configs/prisma.config.js";
import { AppError } from "../errors/app.error.js";
import type { ICreateReview } from "../types/review.d.js";

export class ReviewService {
  async createReview(data: ICreateReview) {
    const order = await prisma.order.findFirst({
      where: {
        customerId: data.customerId,
        eventId: data.eventId,
        status: "PAID",
      },
    });

    if (!order) {
      throw new AppError(403, "You can only review events you have attended");
    }

    const review = await prisma.review.create({
      data: {
        content: data.content,
        customerId: data.customerId,
        eventId: data.eventId,
      },
    });

    return review;
  }

  async getReviewsByEvent(eventId: string) {
    const reviews = await prisma.review.findMany({
      where: { eventId },
      include: {
        customer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return reviews;
  }

  async getMyReviews(customerId: string) {
    const reviews = await prisma.review.findMany({
      where: { customerId },
      include: {
        event: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return reviews;
  }
}
