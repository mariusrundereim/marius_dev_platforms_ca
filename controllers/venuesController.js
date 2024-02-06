import { connectDatabase, closeDatabase } from "../database/database.js";

// Create a venue
// POST

export const createVenue = async (req, res) => {
  let session;
  try {
    const database = await connectDatabase();
    const { title, location, website, phone, email } = req.body;
    console.log(req.body);

    if (!title || !location || !website || !phone || !email) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const existingVenue = await database
      .collection("venues")
      .findOne({ title });
    if (existingVenue) {
      return res.status(409).json({ error: "Venue name already exists" });
    }

    session = database.client.startSession();

    try {
      //Start transaction
      const venuesResult = await database
        .collection("venues")
        .insertOne({ title, location, website, phone, email }, { session });
      await session.commitTransaction();
      res.status(201).json({ insertedId: venuesResult.insertedId });
    } catch (error) {
      //if an error occurs, abort it
      await session.abortTransaction();
      console.error(error);
      res
        .status(500)
        .json({ error: "Failed to create the venue, please try again" });
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred on the server" });
  } finally {
    // Database connection closed
    await closeDatabase();
  }
};

// PUT
// Update venue details

export const updateVenue = async (req, res) => {
  let session;
  try {
    const database = await connectDatabase();
  } catch (error) {}
};

// DELETE
// A venue

// GET
// All venues

// GET
// All events for a specific venue
