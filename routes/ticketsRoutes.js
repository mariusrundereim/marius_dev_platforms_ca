import express from "express";
import {
  createTicket,
  deleteTicket,
  getAllTickets,
  ticketsForSpecificEvent,
} from "../controllers/ticketsController.js";
const router = express.Router();
// Get all tickets
router.get("/", getAllTickets);
// Get all tickets for a specific event (ticketsForSpecificEvent)
router.get("/:event_ID", ticketsForSpecificEvent);
router.post("/:event_ID/tickets", createTicket);
router.delete("/:id", deleteTicket);

export default router;
