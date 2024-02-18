import express from "express";
import "dotenv/config.js";

// Import routes
import venuesRoutes from "./routes/venuesRoutes.js";
import eventsRoutes from "./routes/eventsRoutes.js";
import ticketsRoutes from "./routes/ticketsRoutes.js";
import attendeesRoutes from "./routes/attendeesRoutes.js";
import companiesRoutes from "./routes/companiesRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use("/venues", venuesRoutes);
app.use("/events", eventsRoutes);
app.use("/tickets", ticketsRoutes);
app.use("/attendees", attendeesRoutes);
app.use("/companies", companiesRoutes);

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
