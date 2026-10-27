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
import { loadProvider } from "../middleware/loadProvider.js";
import { canEditProvider } from "../providerRules.js";
import { requireProviderRule } from "../middleware/requireProviderRule.js";
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
  loadProvider,
  requireProviderRule(
    canEditProvider,
    "Only the provider who created this listing may edit it.",
  ),
  validateBody(updateProviderSchema),
  updateProvider,
);
providersRouter.delete(
  "/:id",
  requirePermission("provider", "delete"),
  deleteProvider,
);
