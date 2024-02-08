import express from "express";
import {
  createTicket,
  deleteTicket,
} from "../controllers/ticketsController.js";
const router = express.Router();

router.post("/events/:event_ID/tickets", createTicket);
router.delete("/events/:id", deleteTicket);

export default router;
