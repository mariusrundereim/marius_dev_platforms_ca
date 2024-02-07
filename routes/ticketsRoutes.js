import express from "express";
import { createTicket } from "../controllers/ticketsController.js";
const router = express.Router();

router.post("/events/:event_ID/tickets", createTicket);

export default router;
