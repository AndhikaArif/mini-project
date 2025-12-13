import express from "express";
import { OrderController } from "../controllers/order.controller.js";

const orderController = new OrderController();

const router = express.Router();

router.route("/create").post(orderController.createOrder);
router.route("/").get(orderController.getAllCustomerOrders);
router.route("/:id").get(orderController.getOrderById);
router.route("/:id/orders").get(orderController.getAllEventOrders);

export default router;
