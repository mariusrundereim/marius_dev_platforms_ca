import express from "express";
import {
  createAttendee,
  getSingleAttendeeById,
  deleteAttendee,
  updateAttendee,
} from "../controllers/attendeesController.js";
const router = express.Router();

/**
 * @swagger
 * /attendees:
 *   post:
 *     summary: Create or update an attendee
 *     description: If the attendee exists (based on email), adds a new ticket to their list. If not, creates a new attendee.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - ticketId
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               ticketId:
 *                 type: string
 *                 example: "abcd1234"
 *     responses:
 *       201:
 *         description: Attendee created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 insertedId:
 *                   type: string
 *                   description: The ID of the created attendee.
 *                   example: "507f1f77bcf86cd799439011"
 *                 message:
 *                   type: string
 *                   example: "John is created successfully."
 *       200:
 *         description: Ticket added to existing attendee.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ticket added to existing attendee"
 *       400:
 *         description: Missing fields in the request body.
 *       404:
 *         description: Attendee not found when attempting to add a ticket.
 *       500:
 *         description: Server error or failed to create the attendee.
 */

router.post("/", createAttendee);
router.get("/:id", getSingleAttendeeById);
router.delete("/:id", deleteAttendee);
router.patch("/:id", updateAttendee);

export default router;
