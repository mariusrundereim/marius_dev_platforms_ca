import express from "express";
import "dotenv/config.js";
import venuesRoutes from "./routes/venuesRoutes.js";
import eventsRoutes from "./routes/eventsRoutes.js";
import ticketsRoutes from "./routes/ticketsRoutes.js";
import attendeesRoutes from "./routes/attendeesRoutes.js";
import companiesRoutes from "./routes/companiesRoutes.js";

const port = process.env.PORT;
const app = express();
app.use(express.json());

app.use("/venues", venuesRoutes);
app.use("/events", eventsRoutes);
app.use("/events", ticketsRoutes);
app.use("/attendees", attendeesRoutes);
app.use("/companies", companiesRoutes);

// Port listen
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
