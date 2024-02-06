import express from "express";
import { createEvent } from "../controllers/eventsController.js";
const router = express.Router();

router.get("/events", createEvent);
// router.get("/events/:id", singleEventById);
// router.get("/events/:id/tickets", ticketsByEvents);

export default router;
