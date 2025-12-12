import express from "express";
import { OrderController } from "../controllers/order.controller.js";

const orderController = new OrderController();

const router = express.Router();

router.route("/create").post(orderController.createOrder);
router
  .route("/")
  .get(orderController.getAllCustomerOrders)
  .get(orderController.getAllEventOrders);
router.route("/:id").get(orderController.getOrderById);

export default router;
