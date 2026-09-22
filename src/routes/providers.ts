import { Router, Request, Response, NextFunction } from "express";

//import { Provider } from "../types/Provider.js";
//import { randomUUID } from "crypto";
import {
  listProviders,
  getProviderById,
  createProvider,
  deleteProvider,
  updateProvider,
} from "../controllers/providersController.js";

export const providersRouter = Router();

providersRouter.get("/", listProviders);
providersRouter.get("/:id", getProviderById);
providersRouter.post("/", createProvider);
providersRouter.patch("/:id", updateProvider);
providersRouter.delete("/:id", deleteProvider);
