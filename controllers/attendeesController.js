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

// Get single attendee by ID
// GET

export const getSingleAttendeeById = async (req, res) => {
  try {
    const database = await connectDatabase();
    const { id } = req.params;
    const attendee = await database
      .collection("attendees")
      .findOne({ _id: new ObjectId(id) });
    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }
    res.status(200).json(attendee);
  } catch (error) {
    // Handle the error here
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await closeDatabase();
  }
};

// Delete attendee
// DELETE

export const deleteAttendee = async (req, res) => {
  try {
    const database = await connectDatabase();
    const { id } = req.params;
    const attendee = await database
      .collection("attendees")
      .deleteOne({ _id: new ObjectId(id) });
    if (attendee.deletedCount === 0) {
      return res.status(404).json({ error: "Attendee not found" });
    }
    res.status(200).json({ message: "Attendee deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await closeDatabase();
  }
};

// Update attendee
// PATCH
export const updateAttendee = async (req, res) => {
  try {
    const database = await connectDatabase();
    const { id } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

    const attendee = await database
      .collection("attendees")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (attendee.matchedCount === 0) {
      return res.status(404).json({ error: "Attendee not found" });
    }

    res.status(200).json({ message: "Attendee updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await closeDatabase();
  }
};
