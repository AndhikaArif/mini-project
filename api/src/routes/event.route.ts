import express from "express";
import { EventController } from "../controllers/event.controller.js";
import { fileUpload } from "../middlewares/file-upload.middleware.js";
import { AuthMiddleWare } from "../middlewares/auth.middleware.js";
import { RoleType } from "../generated/index.js";

const eventController = new EventController();
const upload = fileUpload();

const router = express.Router();

router.route("/").get(eventController.getAllEvents);
router.route("/top-3").get(eventController.getTopThreeEvents);
router.route("/category").get(eventController.getEventsByCategory);
router
  .route("/:id")
  .get(eventController.getEventById)
  .put(
    AuthMiddleWare.verifyToken,
    AuthMiddleWare.roleGuard(RoleType.EVENT_ORGANIZER),
    eventController.updateEvent
  );
router.route("/:id/delete").put(eventController.softDeleteEvent);
router
  .route("/create")
  .post(
    AuthMiddleWare.verifyToken,
    AuthMiddleWare.roleGuard(RoleType.EVENT_ORGANIZER),
    upload.array("eventImage", 5),
    eventController.createEvent
  );

export default router;
