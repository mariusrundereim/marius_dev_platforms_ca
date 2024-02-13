import express from "express";
import {
  createEvent,
  singleEventById,
  getTicketsByEvent,
} from "../controllers/eventsController.js";
const router = express.Router();

router.get("/", createEvent);
router.get("/:id", singleEventById);
router.get("/:id/tickets", getTicketsByEvent);

export default router;
