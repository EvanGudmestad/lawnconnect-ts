import express from "express";
import path from "node:path";
import { providersRouter } from "./routes/providers.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import debug from "debug";
const logger = debug("lawnconnect:index");
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
app.use(requestLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, "../vite-project/dist")));

app.use("/providers", providersRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  logger(`Server is running on http://localhost:${PORT}`);
});
