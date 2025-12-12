import express from "express";
import { PaymentController } from "../controllers/payment.controller.js";

const paymentController = new PaymentController();

const router = express.Router();

router.route("/create").post(paymentController.createPayment);
router.route("/").get(paymentController.getAllPayment);
router
  .route("/:id")
  .get(paymentController.getPaymentById)
  .put(paymentController.updatePayment);

export default router;
