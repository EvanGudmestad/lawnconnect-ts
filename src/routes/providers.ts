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
import { validateBody } from "../middleware/validate.js";
import {
  createProviderSchema,
  updateProviderSchema,
} from "../schemas/providerSchemas.js";
import { validateQuery } from "../middleware/validate.js";
import { listProvidersQuerySchema } from "../schemas/providerSchemas.js";
import { requirePermission } from "../middleware/requirePermission.js";
export const providersRouter = Router();

providersRouter.get(
  "/",
  validateQuery(listProvidersQuerySchema),
  listProviders,
);
providersRouter.get("/:id", getProviderById);
providersRouter.post(
  "/",
  requirePermission("provider", "create"),
  validateBody(createProviderSchema),
  createProvider,
);
providersRouter.patch(
  "/:id",
  requirePermission("provider", "update"),
  validateBody(updateProviderSchema),
  updateProvider,
);
providersRouter.delete(
  "/:id",
  requirePermission("provider", "delete"),
  deleteProvider,
);
