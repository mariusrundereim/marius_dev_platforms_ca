import { connectDatabase, closeDatabase } from "../database/database.js";
import { ObjectId } from "mongodb";

// GET
// All events for a specific venue

export const getSingleVenueById = async (req, res) => {
  try {
    const database = await connectDatabase();
    const venueId = req.params.id;
    const venue = await database
      .collection("venues")
      .findOne({ _id: new ObjectId(venueId) });

    if (!venue) {
      return res.status(404).json({ error: "Venue not found" });
    }
    res.status(200).json(venue);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the venue" });
  } finally {
    await closeDatabase();
  }
};

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
  try {
    const database = await connectDatabase();
    const venueId = req.params.id;
    const { title, location, website, phone, email } = req.body;

    const updateResult = await database
      .collection("venues")
      .updateOne(
        { _id: new ObjectId(venueId) },
        { $set: { title, location, website, phone, email } }
      );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }

    if (updateResult.modifiedCount === 1) {
      res.status(200).json({ message: "Venue updated successfully" });
    } else {
      res.status(200).json({ message: "No changes made to the venue" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the venue" });
  } finally {
    await closeDatabase();
  }
};

// DELETE
// A venue

export const deleteVenue = async (req, res) => {
  try {
    const database = await connectDatabase();
    const venueId = req.params.id;

    const _id = new ObjectId(venueId);

    const deleteResult = await database.collection("venues").deleteOne({ _id });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }
    res.status(200).json({ message: "Venue deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the venue" });
  } finally {
    await closeDatabase();
  }
};

// GET
// All venues

export const allVenues = async (req, res) => {
  try {
    const database = await connectDatabase();
    const venues = await database.collection("venues").find().toArray();
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await closeDatabase();
  }
};
