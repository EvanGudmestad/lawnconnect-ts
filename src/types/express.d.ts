import type { Provider, ProviderUserRef } from "./Provider.js";

declare global {
  namespace Express {
    interface Request {
      user: ProviderUserRef;
      role: string;
      provider: Provider;
    }
  }
}

export {};
