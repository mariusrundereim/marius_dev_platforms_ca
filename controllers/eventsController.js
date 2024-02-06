import { connectDatabase, closeDatabase } from "../database/database.js";
import { ObjectId } from "mongodb";

export const createEvent = async (req, res) => {
  let session;
  try {
    const database = await connectDatabase();
    const { title, description, startDate, endDate, venueId } = req.body;

    if (!title || !description || !startDate || !endDate || !venueId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    //Verify the venue exists
    const venueExists = await database
      .collection("venues")
      .findOne({ _id: new ObjectId(venueId) });
    if (!venueExists) {
      return res.status(404).json({ error: "Venue not found" });
    }
    session = database.client.startSession();
    session.startTransaction();

    // Insert the event
    const eventsResult = await database.collection("events").insertOne(
      {
        title,
        description,
        startDate,
        endDate,
        venueId: new ObjectId(venueId),
      },
      { session }
    );
    await session.commitTransaction();
    res.status(201).json({ insertedId: eventsResult.insertedId });
  } catch (error) {
    if (session) await session.abortTransaction();
    console.error(error);
    res.status(500).json({ error: "Failed to create the event" });
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

// Get a single event by ID
// GET

// Get all ticket types for a specitic event
// GET

// Get all feedback for a specific event
// GET
