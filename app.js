import express from "express";
import "dotenv/config.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { options } from "./swaggerOptions.js";

// Import routes
import venuesRoutes from "./routes/venuesRoutes.js";
import eventsRoutes from "./routes/eventsRoutes.js";
import ticketsRoutes from "./routes/ticketsRoutes.js";
import attendeesRoutes from "./routes/attendeesRoutes.js";
import companiesRoutes from "./routes/companiesRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const swaggerDocs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/venues", venuesRoutes);
app.use("/events", eventsRoutes);
app.use("/events", ticketsRoutes);
app.use("/attendees", attendeesRoutes);
app.use("/companies", companiesRoutes);

// Port
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
