import express from "express";
import "dotenv/config.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import venuesRoutes from "./routes/venuesRoutes.js";
import eventsRoutes from "./routes/eventsRoutes.js";
import ticketsRoutes from "./routes/ticketsRoutes.js";
import attendeesRoutes from "./routes/attendeesRoutes.js";
import companiesRoutes from "./routes/companiesRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event Management API",
      version: "1.0.0",
      description:
        "This is a simple API for managing events, venues, tickets, attendees, and companies",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  // Make sure paths here match your project structure
  apis: ["./routes/*.js"], // Adjust the path as necessary
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Route middlewares
app.use("/venues", venuesRoutes);
app.use("/events", eventsRoutes);
app.use("/events", ticketsRoutes);
app.use("/attendees", attendeesRoutes);
app.use("/companies", companiesRoutes);

// Port
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
