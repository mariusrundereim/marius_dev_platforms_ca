import express from "express";
import {
  getCompanies,
  createCompany,
  findCompany,
} from "../controllers/companiesController.js";
const router = express.Router();

router.get("/", getCompanies);
router.get("/:id", findCompany);
router.post("/", createCompany);

export default router;
