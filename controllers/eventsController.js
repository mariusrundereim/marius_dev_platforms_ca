import { connectDatabase, closeDatabase } from "../database/database.js";
import { ObjectId } from "mongodb";
// Delete a single event by ID
// DELETE

export const deleteEvent = async (req, res) => {
  let session;
  try {
    const database = await connectDatabase();
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Missing event ID" });
    }

    session = database.client.startSession();
    session.startTransaction();

    const events = database.collection("events");
    const event = await events.findOne({ _id: new ObjectId(id) });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const tickets = await database
      .collection("tickets")
      .find({ eventId: new ObjectId(id) })
      .toArray();

    if (tickets.length > 0) {
      return res
        .status(409)
        .json({ error: "Cannot delete an event with associated tickets" });
    }

    await events.deleteOne({ _id: new ObjectId(id) }, { session });
    await session.commitTransaction();
    // Changed status code to 200 and added a success message
    res.status(200).json({ message: "Event successfully deleted" });
  } catch (error) {
    if (session) await session.abortTransaction();
    console.error(error);
    res.status(500).json({ error: "Failed to delete the event" });
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

// Get all events
// GET

export const getEvents = async (req, res) => {
  try {
    const database = await connectDatabase();
    const events = await database.collection("events").find({}).toArray();
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await closeDatabase();
  }
};

// Create a new event
// POST

export const createEvent = async (req, res) => {
  let session;
  try {
    const database = await connectDatabase();
    const { title, description, startDate, endDate, venueId, companyId } =
      req.body;

    if (
      !title ||
      !description ||
      !startDate ||
      !endDate ||
      !venueId ||
      !companyId
    ) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Verify the venue exists
    const venueExists = await database
      .collection("venues")
      .findOne({ _id: new ObjectId(venueId) });
    if (!venueExists) {
      return res.status(404).json({ error: "Venue not found" });
    }

    // Verify the company exists
    const companyExists = await database
      .collection("companies")
      .findOne({ _id: new ObjectId(companyId) });
    if (!companyExists) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Check if the event already exists
    const eventExists = await database.collection("events").findOne({
      title,
      startDate,
      venueId: new ObjectId(venueId),
      companyId: new ObjectId(companyId),
    });

    if (eventExists) {
      return res.status(409).json({ error: "Event already exists" }); // 409 Conflict
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
        companyId: new ObjectId(companyId),
      },
      { session }
    );
    await session.commitTransaction();
    res.status(201).json({
      eventId: eventsResult.insertedId,
      message: `${title} created successfully.`,
    });
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
