import express from "express";
import { connectDatabase, closeDatabase } from "./database/database.js";
import "dotenv/config.js";
import venuesRoutes from "./routes/venuesRoutes.js";

const port = process.env.PORT;
const app = express();
app.use(express.json());

//check if it works
/*
async function run() {
  try {
    const db = await connectDatabase("admin");
    await db.command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    await closeDatabase();
  }
}
run().catch(console.dir);
*/
app.use("/", venuesRoutes);

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
