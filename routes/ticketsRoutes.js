import express from "express";
import {
  createTicket,
  deleteTicket,
} from "../controllers/ticketsController.js";
const router = express.Router();

router.post("/:event_ID/tickets", createTicket);
router.delete("/:id", deleteTicket);

export default router;
