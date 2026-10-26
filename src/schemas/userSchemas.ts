import { z } from "zod";
import { roleNames } from "../permissions.js";

export const setRoleSchema = z.object({
  role: z.enum(roleNames),
});
