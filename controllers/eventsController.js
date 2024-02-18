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

export const singleEventById = async (req, res) => {
  try {
    const database = await connectDatabase();
    const events = await database.collection("events");
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Missing event ID" });
    }

    const query = { _id: new ObjectId(id) };
    const options = {};
    const eventHandler = await events.findOne(query, options);

    if (!eventHandler) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.send(eventHandler);
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    res.status(500).json({ error: "internal server error" });
  } finally {
    await closeDatabase();
  }
};

// Get all tickets for a specific event
// GET

export const getTicketsByEvent = async (req, res) => {
  try {
    const database = await connectDatabase();
    const { id } = req.params;
    const event = await database
      .collection("events")
      .findOne({ _id: new ObjectId(id) });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const tickets = await database
      .collection("tickets")
      .find({ eventId: new ObjectId(id) })
      .toArray();

    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await closeDatabase();
  }
};
