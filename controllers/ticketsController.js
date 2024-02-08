import { connectDatabase, closeDatabase } from "../database/database.js";
import { ObjectId } from "mongodb";

// POST
// Create a ticket for an event
export const createTicket = async (req, res) => {
  let session;
  try {
    const database = await connectDatabase();
    const eventId = req.params.event_ID;
    const { title, price, quantity } = req.body;

    if (!eventId || !title || !price || !quantity) {
      return res.status(400).json({ error: "Missing fields for Ticket" });
    }

    // Verify the event exists and retrieve details
    const event = await database
      .collection("events")
      .findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    session = await database.client.startSession();
    session.startTransaction();

    // Insert the ticket
    const ticketResult = await database.collection("tickets").insertOne(
      {
        eventId: new ObjectId(eventId),
        title,
        price,
        quantity,
      },
      { session }
    );

    await session.commitTransaction();

    // Respond with ticket and event details (and optionally venue details)
    res.status(201).json({
      ticket: {
        insertedId: ticketResult.insertedId,
        title,
        price,
        quantity,
      },
      event: {
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        // Optionally include venue details
        // venue: { title: venue.title, location: venue.location }
      },
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    console.error(error);
    res.status(500).json({ error: "Failed to create the ticket" });
  } finally {
    if (session) {
      session.endSession();
    }
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
