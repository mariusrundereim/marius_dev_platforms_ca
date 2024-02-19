import express from "express";
import {
  getCompanies,
  createCompany,
  findCompany,
  getCompaniesWithEvents,
} from "../controllers/companiesController.js";
const router = express.Router();

router.get("/", getCompanies);
router.get("/:id", findCompany);
router.post("/", createCompany);
router.get("/:id/events", getCompaniesWithEvents);

export default router;
