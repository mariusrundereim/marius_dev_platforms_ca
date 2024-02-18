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
    session = await database.client.startSession();

    const eventId = req.params.event_ID;
    const { price, quantity, attendeeId } = req.body;

    if (!eventId || !price || !quantity || !attendeeId) {
      return res
        .status(400)
        .json({ error: "Missing fields for Ticket creation" });
    }

    session.startTransaction();

    // Fetching
    const [event, attendee, venue] = await Promise.all([
      database
        .collection("events")
        .findOne({ _id: new ObjectId(eventId) }, { session }),
      database
        .collection("attendees")
        .findOne({ _id: new ObjectId(attendeeId) }, { session }),
      database
        .collection("venues")
        .findOne({ _id: new ObjectId(event.venueId) }, { session }),
    ]);

    if (!event || !attendee || !venue) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ error: "Event, Attendee, or Venue not found" });
    }

    // Insert
    const ticketResult = await database.collection("tickets").insertOne(
      {
        eventId: new ObjectId(eventId),
        eventTitle: event.title,
        attendeeId: new ObjectId(attendeeId),
        attendeeName: `${attendee.firstName} ${attendee.lastName}`,
        venueId: new ObjectId(event.venueId),
        venueLocation: venue.location,
        price: price,
        quantity: quantity,
        companyName: venue.title,
      },
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      message: "Ticket created successfully",
      ticket: ticketResult.ops[0],
    });
  } catch (error) {
    console.error(error);
    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }
    res.status(500).json({ error: "Failed to create the ticket" });
  } finally {
    if (session) {
      await session.endSession(); // Ensures session ends only here
    }
    await closeDatabase();
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
