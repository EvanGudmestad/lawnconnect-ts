import { Router } from "express";
import { suggest } from "../controllers/assistantController.js";
import { validateBody } from "../middleware/validate.js";
import { assistantInputSchema } from "../schemas/assistantSchemas.js";

export const assistantRouter = Router();

assistantRouter.post("/", validateBody(assistantInputSchema), suggest);
