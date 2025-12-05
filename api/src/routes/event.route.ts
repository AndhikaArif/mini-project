import express from "express";
import { EventController } from "../controllers/event.controller.js";

const eventController = new EventController();

const router = express.Router();

router.route("/").get(eventController.getAllEvents);
router
  .route("/:id")
  .get(eventController.getEventById)
  .patch(eventController.updateEvent) // pakai put atau patch?
  .delete(eventController.deleteEvent);
router.route("/create").post(eventController.createEvent);

export default router;

// belum menggunakan roleguard, semua role bisa create event
