import { Request, Response, NextFunction } from "express";
import { findProvidersNearZip, demoProviders } from "../domain/matching.js";
import { Provider } from "../types/Provider.js";
import { randomUUID } from "crypto";
import debug from "debug";
const logger = debug("lawnconnect:index");

export async function listProviders(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const zip = req.query.zip as string | undefined;
    res.json(zip ? await findProvidersNearZip(zip) : demoProviders);
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
    const provider = demoProviders.find((p) => p.id === req.params.id);
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
      return res.status(400).json({ error: "name and email are required" });
    }
    const newProvider: Provider = {
      id: randomUUID(),
      name,
      email,
      phone,
      serviceAreaZipCodes,
      servicesOffered,
    };
    demoProviders.push(newProvider);
    res.status(201).json(newProvider);
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
    const provider = demoProviders.find((p) => p.id === req.params.id);

    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }
    const { name, email, phone, serviceAreaZipCodes, servicesOffered } =
      req.body;
    if (name !== undefined) provider.name = name;
    if (email !== undefined) provider.email = email;
    if (phone !== undefined) provider.phone = phone;
    if (serviceAreaZipCodes !== undefined)
      provider.serviceAreaZipCodes = serviceAreaZipCodes;
    if (servicesOffered !== undefined)
      provider.servicesOffered = servicesOffered;
    res.json(provider);
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
    const index = demoProviders.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Provider not found" });
    }
    demoProviders.splice(index, 1);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
