import { connectDatabase, closeDatabase } from "../database/database.js";
import { ObjectId } from "mongodb";

// GET
// Get all companies

export const getCompanies = async (req, res) => {
  try {
    const database = await connectDatabase();
    const companies = await database.collection("companies").find().toArray();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await closeDatabase();
  }
};

// GET
// Get all single company

export const findCompany = async (req, res) => {
  try {
    const database = await connectDatabase();
    const companyId = req.params.id;
    const company = await database
      .collection("companies")
      .findOne({ _id: new ObjectId(companyId) });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await closeDatabase();
  }
};

// POST
// Create a company

export const createCompany = async (req, res) => {
  let session;
  try {
    const database = await connectDatabase();
    session = database.client.startSession();
    session.startTransaction();

    const { companyName, orgNumber, email, phone, address, website } = req.body;
    if (
      !companyName ||
      !orgNumber ||
      !email ||
      !phone ||
      !address ||
      !website
    ) {
      await session.endSession();
      return res.status(400).json({ error: "Missing fields" });
    }
    console.log(req.body);

    const existingCompany = await database
      .collection("companies")
      .findOne({ companyName });
    if (existingCompany) {
      await session.endSession();
      return res.status(409).json({ error: "Company name already exists" });
    }

    const companiesResult = await database
      .collection("companies")
      .insertOne(
        { companyName, orgNumber, email, phone, address, website },
        { session }
      );
    await session.commitTransaction();
    res.status(201).json({ insertedId: companiesResult.insertedId });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to create company, please try again" });
  } finally {
    await closeDatabase();
  }
};
