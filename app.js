import express from "express";
import "dotenv/config.js";
import venuesRoutes from "./routes/venuesRoutes.js";
import eventsRoutes from "./routes/eventsRoutes.js";
import ticketsRoutes from "./routes/ticketsRoutes.js";

const port = process.env.PORT;
const app = express();
app.use(express.json());

app.use("/", venuesRoutes);
app.use("/", eventsRoutes);
app.use("/", ticketsRoutes);

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
