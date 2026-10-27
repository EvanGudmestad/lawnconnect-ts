import type { Provider, ProviderUserRef } from "./types/Provider.js";

// Who may edit a provider listing? Only the person who created it.
// (A listing with no createdBy, like the three seeded in Module 3, has no owner,
// so nobody passes this check.)
export function canEditProvider(
  provider: Provider,
  user: ProviderUserRef,
): boolean {
  console.log(
    `canEditProvider: provider.createdBy?.userId=${provider.createdBy?.userId}, user.userId=${user.userId}`,
  );
  return provider.createdBy?.userId === user.userId;
}
