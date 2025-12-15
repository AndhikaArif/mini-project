import express from "express";
import { EventController } from "../controllers/event.controller.js";

const eventController = new EventController();

const router = express.Router();

router.route("/").get(eventController.getAllEvents);
router.route("/top-3").get(eventController.getTopThreeEvents);
router.route("/category").get(eventController.getEventsByCategory);
router
  .route("/:id")
  .get(eventController.getEventById)
  .put(eventController.updateEvent)
  .put(eventController.deleteEvent);
router.route("/create").post(eventController.createEvent);

export default router;

// belum menggunakan roleguard, semua role bisa create event
