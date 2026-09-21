import { MongoClient, Db, Collection } from "mongodb";
import type { ProviderDocument } from "./types/Provider.js";

const MONGO_URI = process.env.MONGO_URI as string;
const DB_NAME = process.env.DB_NAME as string;

if (!MONGO_URI) {
  throw new Error("Missing required environment variable: MONGO_URI");
}
if (!DB_NAME) {
  throw new Error("Missing required environment variable: DB_NAME");
}

const client = new MongoClient(MONGO_URI);

let db: Db;

export async function connectToDatabase(): Promise<Db> {
  await client.connect();
  db = client.db(DB_NAME);
  return db;
}

export function getProvidersCollection(): Collection<ProviderDocument> {
  return db.collection<ProviderDocument>("providers");
}

export async function closeDatabaseConnection(): Promise<void> {
  await client.close();
}

// export async function connectToDatabase() {
//   await client.connect();
//   return client.db(process.env.DB_NAME as string);
// }

export { client };
