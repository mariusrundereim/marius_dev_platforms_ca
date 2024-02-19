import express from "express";
import {
  createEvent,
  singleEventById,
  getTicketsByEvent,
  getEvents,
  deleteEvent,
} from "../controllers/eventsController.js";
const router = express.Router();

router.get("/", getEvents);
router.post("/", createEvent);
router.get("/:id", singleEventById);
router.get("/:id/tickets", getTicketsByEvent);
router.delete("/:id", deleteEvent);

export default router;
