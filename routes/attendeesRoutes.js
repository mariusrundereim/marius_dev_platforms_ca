import express from "express";
import {
  createAttendee,
  getSingleAttendeeById,
  deleteAttendee,
  updateAttendee,
} from "../controllers/attendeesController.js";
const router = express.Router();

router.post("/", createAttendee);
router.get("/:id", getSingleAttendeeById);
router.delete("/:id", deleteAttendee);
router.patch("/:id", updateAttendee);

export default router;
