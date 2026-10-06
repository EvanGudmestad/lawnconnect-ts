import express from "express";
import path from "node:path";
import cors from "cors";
import { providersRouter } from "./routes/providers.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();
app.use(cors());
app.use(requestLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, "../vite-project/dist")));
app.use("/providers", providersRouter);
app.use(errorHandler);
