import express from "express";
import { createVenue } from "../controllers/venuesController.js";

const router = express.Router();

router.post("/venues", createVenue);

export default router;
