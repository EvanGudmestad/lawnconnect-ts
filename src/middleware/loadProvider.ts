import type { Request, Response, NextFunction } from "express";
import { findProviderById } from "../domain/providers.js";

// Finds the provider named in the URL and puts it on req.provider.
// If there is no such provider, it answers 404 and stops.
export async function loadProvider(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const provider = await findProviderById(req.params.id as string);
    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }
    req.provider = provider;
    next();
  } catch (err) {
    next(err);
  }
}
