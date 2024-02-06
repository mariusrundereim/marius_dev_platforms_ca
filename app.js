import express from "express";
import "dotenv/config.js";
import venuesRoutes from "./routes/venuesRoutes.js";
import eventsRoutes from "./routes/eventsRoutes.js";

const port = process.env.PORT;
const app = express();
app.use(express.json());

app.use("/", venuesRoutes);
app.use("/", eventsRoutes);

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
