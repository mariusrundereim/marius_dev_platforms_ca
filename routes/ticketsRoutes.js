import express from "express";
import {
  createTicket,
  deleteTicket,
  getAllTickets,
  ticketsForSpecificEvent,
} from "../controllers/ticketsController.js";
const router = express.Router();

router.get("/", getAllTickets);
router.get("/:event_ID", ticketsForSpecificEvent);
router.post("/:event_ID/tickets", createTicket);
router.delete("/:id", deleteTicket);

export default router;
