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
    const { name, email, phone, serviceAreaZipCodes, servicesOffered } =
      req.body;
    if (!name || !email) {
      res.status(400).json({ message: "Name and email are required" });
    }

    //construct new provider object
    const newProvider = {
      name,
      email,
      phone: phone || null,
      serviceAreaZipCodes: serviceAreaZipCodes || [],
      servicesOffered: servicesOffered || [],
    };
    const provider = await insertProvider(newProvider);
    res.status(201).json(provider);
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
    const { name, email, phone, serviceAreaZipCodes, servicesOffered } =
      req.body;
    const updates: Partial<Omit<ProviderDocument, "_id">> = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (serviceAreaZipCodes !== undefined)
      updates.serviceAreaZipCodes = serviceAreaZipCodes;
    if (servicesOffered !== undefined)
      updates.servicesOffered = servicesOffered;

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
