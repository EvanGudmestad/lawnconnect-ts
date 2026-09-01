export interface Provider {
  id: string;
  name: string;
  email: string;
  phone?: string;
  serviceAreaZipCodes: string[];
  servicesOffered: string[];
}

export type PublicProvider = Pick<Provider, "id" | "name" | "servicesOffered">;
