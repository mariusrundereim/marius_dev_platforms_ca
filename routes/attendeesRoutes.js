import express from "express";
import { createAttendee } from "../controllers/attendeesController.js";
const router = express.Router();

router.post("/attendees", createAttendee);

export default router;
