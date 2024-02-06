import express from "express";
import {
  allVenues,
  createVenue,
  updateVenue,
  deleteVenue,
} from "../controllers/venuesController.js";

const router = express.Router();

router.get("/venues", allVenues);
router.post("/venues", createVenue);
router.put("/venues/:id", updateVenue);
router.delete("/venues/:id", deleteVenue);

export default router;
