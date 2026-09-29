import { ProviderUserRef } from "./Provider.js";

declare global {
  namespace Express {
    interface Request {
      user: ProviderUserRef;
    }
  }
}

export {};
