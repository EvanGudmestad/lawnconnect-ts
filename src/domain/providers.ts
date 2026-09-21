import { ObjectId } from "mongodb";
import { getProvidersCollection } from "../db.js";
import { Provider, toProvider } from "../types/Provider.js";

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
//   return provider?.phone ?? "No phone on file";
// }

//console.log(await findProvidersNearZip("63108")); // Output: Array of providers serving zip code 63108
