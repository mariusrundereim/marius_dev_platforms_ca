import { connectDatabase, closeDatabase } from "../database/database.js";
import { ObjectId } from "mongodb";

// POST
// Create a ticket for an event

export const createTicket = async (req, res) => {
  let session;
  try {
    const database = await connectDatabase();
    // Extract eventId
    const eventId = req.params.event_ID;
    const { title, price, quantity } = req.body;

    // Validate the required fields
    if (!eventId || !title || !price || !quantity) {
      return res.status(400).json({ error: "Missing fields on Ticket" });
    }

    //Verify the event exists
    const eventExists = await database
      .collection("events")
      .findOne({ _id: new ObjectId(eventId) });

    if (!eventExists) {
      return res.status(404).json({ error: "Event not found" });
    }

    session = await database.client.startSession();
    session.startTransaction();

    //Insert the ticket
    const ticketResult = await database
      .collection("tickets")
      .insertOne(
        { eventId: new ObjectId(eventId), title, price, quantity },
        { session }
      );

    //Commit the transaction
    await session.commitTransaction();
    res.status(201).json({ insertedId: ticketResult.insertedId });
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
