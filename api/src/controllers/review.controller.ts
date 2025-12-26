import type { Request, Response, NextFunction } from "express";
import { ReviewService } from "../services/review.service.js";
import { AppError } from "../errors/app.error.js";

const reviewService = new ReviewService();

export class ReviewController {
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.currentUser!.id;
      const { eventId, content } = req.body;

      if (!eventId || !content) {
        throw new AppError(400, "Event ID and content are required");
      }

      const review = await reviewService.createReview({
        customerId,
        eventId,
        content,
      });

      res.status(201).json({ message: "Success create review", review });
    } catch (error) {
      next(error);
    }
  }

  async getReviewsByEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;

      if (!eventId) {
        throw new AppError(400, "Event ID is required");
      }

      const reviews = await reviewService.getReviewsByEvent(eventId);
      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  }

  async getMyReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.currentUser!.id;
      const reviews = await reviewService.getMyReviews(customerId);
      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  }
}
