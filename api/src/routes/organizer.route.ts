import express from "express";
import { OrganizerController } from "../controllers/organizer.controller.js";
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";
import { RoleType } from "../generated/index.js";

const router = express.Router();
const controller = new OrganizerController();

router.use(
  AuthMiddleWare.verifyToken,
  AuthMiddleWare.roleGuard(RoleType.EVENT_ORGANIZER)
);

router.get("/events", controller.getMyEvents);
router.get("/transactions", controller.getTransactions);
router.get("/dashboard/stats", controller.getDashboardStats);

export default router;
