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
import { attachCurrentUser } from "../middleware/currentUser.js";

export const providersRouter = Router();

providersRouter.get("/", listProviders);
providersRouter.get("/:id", getProviderById);
providersRouter.post(
  "/",
  attachCurrentUser,
  validateBody(createProviderSchema),
  createProvider,
);
providersRouter.patch(
  "/:id",
  validateBody(updateProviderSchema),
  updateProvider,
);
providersRouter.delete("/:id", deleteProvider);
