import express from "express";
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";
import { RoleType } from "../generated/index.js";
import { ReviewController } from "../controllers/review.controller.js";

const router = express.Router();
const reviewController = new ReviewController();

router.post(
  "/",
  AuthMiddleWare.verifyToken,
  AuthMiddleWare.roleGuard(RoleType.CUSTOMER),
  reviewController.createReview
);

router.get("/:eventId", reviewController.getReviewsByEvent);

router.get(
  "/my",
  AuthMiddleWare.verifyToken,
  AuthMiddleWare.roleGuard(RoleType.CUSTOMER),
  reviewController.getMyReviews
);

export default router;
