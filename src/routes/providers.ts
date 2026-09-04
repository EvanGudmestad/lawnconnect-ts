import { Router, Request, Response } from "express";
import {
  findProvidersNearZip,
  findProvidersByZip,
  demoProviders,
} from "../domain/matching.js";
import { Provider } from "../types/Provider.js";
import { randomUUID } from "crypto";

export const providersRouter = Router();

// This route will run when the user visits http://localhost:3000/providers/
providersRouter.get("/", (req: Request, res: Response) => {
  res.json(demoProviders);
});

//this route will run when the user visits http://localhost:3000/providers/zip/:zip
providersRouter.get("/zip/:zip", async (req: Request, res: Response) => {
  const providers = await findProvidersNearZip(req.params.zip as string);
  if (providers.length > 0) {
    res.json(providers);
  } else {
    res.status(404).json({ message: "No providers found for this zip code" });
  }
});

//Express can't differentiate between the two GET routes above,
//if I pass p3 into the route it will think that p3 is a zip code and return an empty array.
providersRouter.get("/:id", (req: Request, res: Response) => {
  const provider = demoProviders.find((p) => p.id === req.params.id);
  if (provider) {
    res.json(provider);
  } else {
    res.status(404).json({ message: "Provider not found" });
  }
});

//post route for adding a new provider
//route is http://localhost:3000/providers/
providersRouter.post("/", (req: Request, res: Response) => {
  const { name, email, phone, serviceAreaZipCodes, servicesOffered } = req.body;
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
});
