import { ObjectId } from "mongodb";
import { getProvidersCollection } from "../db.js";
import {
  Provider,
  toProvider,
  ProviderDocument,
  ProviderUserRef,
} from "../types/Provider.js";
import { randomUUID } from "node:crypto";
import {
  CreateReviewInput,
  UpdateReviewInput,
} from "../schemas/reviewSchema.js";

export async function findAllProviders(): Promise<Provider[]> {
  const docs = await getProvidersCollection().find().toArray();
  return docs.map(toProvider);
}

export async function findProvidersNearZip(zip: string): Promise<Provider[]> {
  try {
    const docs = await getProvidersCollection()
      .find({ serviceAreaZipCodes: zip })
      .toArray();
    return docs.map(toProvider);
  } catch (error) {
    console.error("findProvidersNearZip failed:", error);
    return [];
  }
}

export async function findProviderById(id: string): Promise<Provider | null> {
  if (!ObjectId.isValid(id)) return null;
  const doc = await getProvidersCollection().findOne({ _id: new ObjectId(id) });
  return doc ? toProvider(doc) : null;
}

export async function insertProvider(
  input: Omit<ProviderDocument, "_id">,
): Promise<Provider> {
  const collection = getProvidersCollection();
  const result = await collection.insertOne(input);
  const doc = await collection.findOne({ _id: result.insertedId });
  return toProvider(doc!);
}

export async function deleteProviderById(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const result = await getProvidersCollection().deleteOne({
    _id: new ObjectId(id),
  });
  return result.deletedCount > 0;
}

export async function updateProviderById(
  id: string,
  updates: Partial<Omit<ProviderDocument, "_id">>,
): Promise<Provider | null> {
  if (!ObjectId.isValid(id)) return null;
  const result = await getProvidersCollection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updates },
    { returnDocument: "after" },
  );
  return result ? toProvider(result) : null;
}

export async function addReviewToProvider(
  providerId: string,
  input: CreateReviewInput,
  author: ProviderUserRef,
): Promise<Provider | null> {
  if (!ObjectId.isValid(providerId)) return null;
  const review = {
    _id: randomUUID(),
    ...input,
    createdAt: new Date(),
    author,
  };
  const result = await getProvidersCollection().findOneAndUpdate(
    { _id: new ObjectId(providerId) },
    { $push: { reviews: review } },
    { returnDocument: "after" },
  );
  return result ? toProvider(result) : null;
}

export async function removeReviewFromProvider(
  providerId: string,
  reviewId: string,
): Promise<boolean> {
  if (!ObjectId.isValid(providerId)) return false;
  const result = await getProvidersCollection().findOneAndUpdate(
    { _id: new ObjectId(providerId) },
    { $pull: { reviews: { _id: reviewId } } },
  );
  return result !== null;
}

export async function updateReviewOnProvider(
  providerId: string,
  reviewId: string,
  updates: UpdateReviewInput,
): Promise<Provider | null> {
  if (!ObjectId.isValid(providerId)) return null;
  const result = await getProvidersCollection().findOneAndUpdate(
    { _id: new ObjectId(providerId) },
    {
      $set: {
        ...(updates.rating !== undefined && {
          "reviews.$[review].rating": updates.rating,
        }),
        ...(updates.comment !== undefined && {
          "reviews.$[review].comment": updates.comment,
        }),
      },
    },
    { arrayFilters: [{ "review._id": reviewId }], returnDocument: "after" },
  );
  return result ? toProvider(result) : null;
}
