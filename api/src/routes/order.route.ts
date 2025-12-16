import express from "express";
import { OrderController } from "../controllers/order.controller.js";
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";
import { RoleType } from "../generated/client.js";

const orderController = new OrderController();

const router = express.Router();

router
  .route("/create")
  .post(
    AuthMiddleWare.verifyToken,
    AuthMiddleWare.roleGuard(RoleType.CUSTOMER),
    orderController.createOrder
  );
router
  .route("/")
  .get(
    AuthMiddleWare.verifyToken,
    AuthMiddleWare.roleGuard(RoleType.CUSTOMER),
    orderController.getAllCustomerOrders
  );
router
  .route("/:id")
  .get(AuthMiddleWare.verifyToken, orderController.getOrderById);
router
  .route("/:id/orders")
  .get(
    AuthMiddleWare.verifyToken,
    AuthMiddleWare.roleGuard(RoleType.EVENT_ORGANIZER),
    orderController.getAllEventOrders
  );

export default router;
