import { Request, Response, NextFunction } from "express";
import {
  findAllProviders,
  findProvidersNearZip,
  findProviderById,
  insertProvider,
  deleteProviderById,
  updateProviderById,
} from "../domain/providers.js";
import { ProviderDocument } from "../types/Provider.js";
import {
  CreateProviderInput,
  UpdateProviderInput,
} from "../schemas/providerSchemas.js";

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

export async function createProvider(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = req.body as CreateProviderInput;
    const newProvider = await insertProvider(input);
    res.status(201).json(newProvider);
  } catch (err) {
    next(err);
  }
}

export async function deleteProvider(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id as string;
    const deleted = await deleteProviderById(id);
    if (!deleted) {
      return res.status(404).json({ error: "Provider not found" });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function updateProvider(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const updates = req.body as UpdateProviderInput;
    const id = req.params.id as string;
    const provider = await updateProviderById(id, updates);
    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }
    res.json(provider);
  } catch (err) {
    next(err);
  }
}
