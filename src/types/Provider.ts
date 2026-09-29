import { ObjectId } from "mongodb";

export interface ProviderUserRef {
  userId: string; // BetterAuth's user id — placeholder for today's demo
  fullName: string;
}

//Reports the structure of a provider object in the application
export interface Provider {
  id: string;
  name: string;
  email: string;
  phone?: string;
  serviceAreaZipCodes: string[];
  servicesOffered: string[];
  createdBy: ProviderUserRef;
}

export type PublicProvider = Pick<Provider, "id" | "name" | "servicesOffered">;

//Represents the structure of a provider document in the database
export interface ProviderDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  phone?: string;
  serviceAreaZipCodes: string[];
  servicesOffered: string[];
  createdBy: ProviderUserRef;
}

//Convert a document into a provider object
export function toProvider(doc: ProviderDocument): Provider {
  return {
    id: doc._id!.toHexString(),
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    serviceAreaZipCodes: doc.serviceAreaZipCodes,
    servicesOffered: doc.servicesOffered,
    createdBy: doc.createdBy,
  };
}
