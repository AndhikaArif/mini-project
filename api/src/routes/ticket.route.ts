import express from "express";
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";
import { RoleType } from "../generated/index.js";
import { TicketController } from "../controllers/ticket.controller.js";

const router = express.Router();
const ticketController = new TicketController();

router
  .route("/")
  .get(
    AuthMiddleWare.verifyToken,
    AuthMiddleWare.roleGuard(RoleType.CUSTOMER),
    ticketController.getMyTickets
  );
router
  .route("/:id")
  .get(
    AuthMiddleWare.verifyToken,
    AuthMiddleWare.roleGuard(RoleType.CUSTOMER),
    ticketController.getTicketDetailById
  );

export default router;
