import { connectDatabase, closeDatabase } from "../database/database.js";
import { ObjectId } from "mongodb";

// GET
// Get all tickets

export const getAllTickets = async (req, res) => {
  try {
    const database = await connectDatabase();
    const tickets = await database.collection("tickets").find({}).toArray();
    res.status(200).json({ tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching tickets" });
  } finally {
    await closeDatabase();
  }
};

// GET
// Get all tickets for a specific event

export const ticketsForSpecificEvent = async (req, res) => {
  try {
    const database = await connectDatabase();
    const eventId = req.params.event_ID;
    const tickets = await database
      .collection("tickets")
      .find({ eventId: new ObjectId(eventId) })
      .toArray();

    if (tickets.length === 0) {
      return res.status(404).json({ error: "No tickets found for this event" });
    }

    res.status(200).json({ tickets });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching event tickets" });
  } finally {
    await closeDatabase();
  }
};

// POST
// Create a ticket for an event

export const createTicket = async (req, res) => {
  let session = null;
  try {
    const database = await connectDatabase();
    session = database.client.startSession();

    const eventId = req.params.event_ID;
    const { price, quantity, attendeeId } = req.body;

    if (!eventId || !price || !quantity || !attendeeId) {
      return res
        .status(400)
        .json({ error: "Missing fields for Ticket creation" });
    }
    session.startTransaction();

    const existingTicket = await database.collection("tickets").findOne(
      {
        eventId: new ObjectId(eventId),
        attendeeId: new ObjectId(attendeeId),
      },
      { session }
    );

    if (existingTicket) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(409)
        .json({ error: "Ticket for this event and attendee already exists" });
    }

    // Fetching the event
    const event = await database
      .collection("events")
      .findOne({ _id: new ObjectId(eventId) }, { session });

    if (!event) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Event not found" });
    }

    // Fetching the attendee
    const attendee = await database
      .collection("attendees")
      .findOne({ _id: new ObjectId(attendeeId) }, { session });

    if (!attendee) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Attendee not found" });
    }

    const venue = await database
      .collection("venues")
      .findOne({ _id: new ObjectId(event.venueId) }, { session });

    if (!venue) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Venue not found" });
    }

    // Insert the ticket
    const ticketResult = await database.collection("tickets").insertOne(
      {
        eventId: new ObjectId(eventId),
        eventTitle: event.title,
        attendeeId: new ObjectId(attendeeId),
        attendeeName: `${attendee.firstName} ${attendee.lastName}`,
        venueId: new ObjectId(event.venueId),
        venueLocation: venue.location,
        price,
        quantity,
        companyName: event.title,
      },
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      message: "Ticket created successfully",
      ticketId: ticketResult.insertedId,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    if (session) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
    }
    res.status(500).json({
      error: "Failed to create the ticket. Check server logs for details.",
    });
  }
};

// PUT
// Update ticket details

// DELETE
// Delete a ticket

export const deleteTicket = async (req, res) => {
  try {
    const database = await connectDatabase();
    const ticketId = req.params.id;

    const _id = new ObjectId(ticketId);

    const deleteResult = await database
      .collection("tickets")
      .deleteOne({ _id });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the ticket" });
  } finally {
    await closeDatabase();
  }
};
