import { Request, Response, NextFunction } from "express";
import {
  findAllProviders,
  findProvidersNearZip,
  findProviderById,
} from "../domain/providers.js";
//import { Provider } from "../types/Provider.js";
//import { randomUUID } from "crypto";
//import debug from "debug";
//const logger = debug("lawnconnect:index");

export async function listProviders(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const zip = req.query.zip as string | undefined;
    res.json(zip ? await findProvidersNearZip(zip) : await findAllProviders());
  } catch (err) {
    next(err);
  }
}

export async function getProviderById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id as string;
    const provider = await findProviderById(id);
    if (provider) {
      res.json(provider);
    } else {
      res.status(404).json({ message: "Provider not found" });
    }
  } catch (err) {
    next(err);
  }
}
