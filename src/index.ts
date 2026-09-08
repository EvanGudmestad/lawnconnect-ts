import express from "express";
import { providersRouter } from "./routes/providers.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import debug from "debug";
const logger = debug("lawnconnect:index");

const app = express();

const PORT = process.env.PORT || 3000;
app.use(requestLogger);
app.use(express.json());
app.use("/providers", providersRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  logger(`Server is running on http://localhost:${PORT}`);
});
