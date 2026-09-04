import { Provider } from "../types/Provider.js";

export const demoProviders: Provider[] = [
  {
    id: "p1",
    name: "Sunrise Lawn Care",
    email: "contact@sunriselawn.com",
    phone: "555-201-4477",
    serviceAreaZipCodes: ["63108", "63110"],
    servicesOffered: ["mowing", "edging"],
  },
  {
    id: "p2",
    name: "GreenScape Mowing",
    email: "hello@greenscapemowing.com",
    phone: undefined,
    serviceAreaZipCodes: ["63108"],
    servicesOffered: ["mowing"],
  },
  {
    id: "p3",
    name: "Lawn Legends",
    email: "lawnlegends@gmail.com",
    phone: "555-987-6543",
    serviceAreaZipCodes: ["63109"],
    servicesOffered: ["mowing", "fertilizing", "leaf cleanup"],
  },
];

export async function findProvidersNearZip(zip: string): Promise<Provider[]> {
  try {
    //Eventually this will be a real DB call
    return findProvidersByZip(demoProviders, zip);
  } catch (error) {
    console.error("findProvidersNearZip failed:", error);
    return [];
  }
}

export function findProvidersByZip(
  providers: Provider[],
  zip: string,
): Provider[] {
  return providers.filter((p) => p.serviceAreaZipCodes.includes(zip));
}

export function getProviderContact(provider?: Provider): string {
  return provider?.phone ?? "No phone on file";
}

console.log(await findProvidersNearZip("63108")); // Output: Array of providers serving zip code 63108
