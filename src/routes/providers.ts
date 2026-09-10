import { Router, Request, Response, NextFunction } from "express";
import {
  findProvidersNearZip,
  findProvidersByZip,
  demoProviders,
} from "../domain/matching.js";
import { Provider } from "../types/Provider.js";
import { randomUUID } from "crypto";
import {
  listProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider,
} from "../controllers/providersController.js";

export const providersRouter = Router();

providersRouter.get("/", listProviders);
providersRouter.get("/:id", getProviderById);
providersRouter.post("/", createProvider);
providersRouter.patch("/:id", updateProvider);
providersRouter.delete("/:id", deleteProvider);
