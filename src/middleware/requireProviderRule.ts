import type { Request, Response, NextFunction } from "express";
import type { Provider, ProviderUserRef } from "../types/Provider.js";

// For rules about WHOSE provider it is. Runs after loadProvider.
export function requireProviderRule(
  check: (provider: Provider, user: ProviderUserRef) => boolean,
  message: string,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!check(req.provider, req.user)) {
      return res.status(403).json({ error: message });
    }
    next();
  };
}
