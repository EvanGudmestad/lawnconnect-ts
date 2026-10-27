import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";

// Every thing a role can be allowed to do, grouped by resource.
export const statement = {
  // The plugin's own "user" and "session" actions (set-role, ban, ...)
  ...defaultStatements,
  provider: ["create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const roles = {
  // A customer can look around (any signed-in person can) but change nothing.
  customer: ac.newRole({}),
  provider: ac.newRole({
    provider: ["create", "update"],
  }),
  admin: ac.newRole({
    provider: ["delete", "create", "update"],
    user: ["set-role"],
  }),
};

export type RoleName = keyof typeof roles;
export const roleNames = Object.keys(roles) as [RoleName, ...RoleName[]];
