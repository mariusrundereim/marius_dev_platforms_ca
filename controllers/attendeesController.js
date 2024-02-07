import { connectDatabase, closeDatabase } from "../database/database.js";
import { ObjectId } from "mongodb";

// Create attendee
// POST

export const createAttendee = async (req, res) => {
  let session;
  try {
    const database = await connectDatabase();
    const { firstName, lastName, email, phone, ticketId } = req.body;
    if (!firstName || !lastName || !email || !phone || !ticketId) {
      return res.status(400).json({ error: "Missing fields" });
    }
    console.log(req.body);

    const existingPerson = await database
      .collection("attendees")
      .findOne({ firstName: firstName, lastName: lastName, email: email });
    if (existingPerson) {
      return res.status(409).json({ error: "Attendee name already exists" });
    }

    session = database.client.startSession();

    try {
      const attendeesResult = await database
        .collection("attendees")
        .insertOne(
          { firstName, lastName, email, phone, ticketId },
          { session }
        );
      await session.commitTransaction();
      res.status(201).json({ insertedId: attendeesResult.insertedId });
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      res
        .status(500)
        .json({ error: "Failed to create the attendee, please try again" });
    }
  } catch (error) {
    // Handle the error here
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await closeDatabase();
  }
};
