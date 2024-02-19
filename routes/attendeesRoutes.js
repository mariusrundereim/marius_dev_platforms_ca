import express from "express";
import {
  createAttendee,
  getSingleAttendeeById,
  deleteAttendee,
  updateAttendee,
  getAllAttendees,
} from "../controllers/attendeesController.js";
const router = express.Router();

// Get all attendees
router.get("/", getAllAttendees);
router.get("/:id", getSingleAttendeeById);
router.post("/", createAttendee);
router.delete("/:id", deleteAttendee);
router.patch("/:id", updateAttendee);

export default router;
