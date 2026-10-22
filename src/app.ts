import express from "express";
import path from "node:path";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { providersRouter } from "./routes/providers.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();
app.use(cors());
app.use(requestLogger);

// 1. Auth routes BEFORE express.json()
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, "../vite-project/dist")));
app.use("/providers", providersRouter);
app.use(errorHandler);
