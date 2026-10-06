import { app } from "./app.js";
import { connectToDatabase, closeDatabaseConnection } from "./db.js";
import debug from "debug";

const logger = debug("lawnconnect:index");
const PORT = process.env.PORT || 3000;

await connectToDatabase();
logger("Connected to MongoDB database");

app.listen(PORT, () => {
  logger(`Server is running on http://localhost:${PORT}`);
});

async function shutdown(signal: string) {
  logger(`Received ${signal}. Closing server...`);
  await closeDatabaseConnection();
  logger("Database connection closed. Exiting process.");
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
