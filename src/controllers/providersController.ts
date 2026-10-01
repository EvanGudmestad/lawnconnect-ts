import { Request, Response, NextFunction } from "express";
import {
  addReviewToProvider,
  removeReviewFromProvider,
} from "../domain/providers.js";
import {
  findAllProviders,
  findProvidersNearZip,
  findProviderById,
  insertProvider,
  deleteProviderById,
  updateProviderById,
  updateReviewOnProvider,
} from "../domain/providers.js";
import { ProviderDocument } from "../types/Provider.js";
import {
  CreateProviderInput,
  UpdateProviderInput,
} from "../schemas/providerSchemas.js";
import {
  CreateReviewInput,
  UpdateReviewInput,
} from "../schemas/reviewSchema.js";

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
    const newProvider = await insertProvider({
      ...input,
      createdBy: req.user, // Assuming req.user is populated by authentication middleware
    });
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

export async function addReview(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = req.body as CreateReviewInput;
    const provider = await addReviewToProvider(req.params.id, input, req.user);
    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }
    res.json(provider);
  } catch (err) {
    next(err);
  }
}

export async function removeReview(
  req: Request<{ id: string; reviewId: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    await removeReviewFromProvider(req.params.id, req.params.reviewId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function updateReview(
  req: Request<{ id: string; reviewId: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const updates = req.body as UpdateReviewInput;
    const provider = await updateReviewOnProvider(
      req.params.id,
      req.params.reviewId,
      updates,
    );
    if (!provider) {
      return res.status(404).json({ error: "Provider or review not found" });
    }
    res.json(provider);
  } catch (err) {
    next(err);
  }
}
