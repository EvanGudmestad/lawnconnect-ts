import { ObjectId, Filter } from "mongodb";
import { getProvidersCollection } from "../db.js";
import { Provider, toProvider, ProviderDocument } from "../types/Provider.js";
import { ListProvidersQuery } from "../schemas/providerSchemas.js";

export async function findProviders(
  query: ListProvidersQuery,
): Promise<Provider[]> {
  const filter: Filter<ProviderDocument> = {};
  if (query.zip) filter.serviceAreaZipCodes = query.zip;
  if (query.service) filter.servicesOffered = query.service;

  const cursor = getProvidersCollection().find(filter);

  if (query.sort) {
    const descending = query.sort.startsWith("-");
    const field: string = descending ? query.sort.slice(1) : query.sort;
    cursor.sort({ [field]: descending ? -1 : 1 });
  }
  const skip = (query.page - 1) * query.limit;
  cursor.skip(skip).limit(query.limit);

  const docs = await cursor.toArray();
  return docs.map(toProvider);
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

//   return provider?.phone ?? "No phone on file";
// }

//console.log(await findProvidersNearZip("63108")); // Output: Array of providers serving zip code 63108
