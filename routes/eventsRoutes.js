import express from "express";
const router = express.Router();

router.get("/events", allVenues);

export default router;
