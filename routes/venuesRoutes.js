import express from "express";
import {
  allVenues,
  createVenue,
  updateVenue,
  deleteVenue,
} from "../controllers/venuesController.js";

const router = express.Router();

router.get("/", allVenues);
router.post("/", createVenue);
router.put("/:id", updateVenue);
router.delete("/:id", deleteVenue);

export default router;
