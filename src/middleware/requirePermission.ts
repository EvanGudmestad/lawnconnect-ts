import type { Request, Response, NextFunction } from "express";
import { auth } from "../auth.js";
import { statement } from "../permissions.js";

type Resource = keyof typeof statement;

// Asks the Admin plugin: does this person's current role include
// this permission?

export async function userCan<R extends Resource>(
  userId: string,
  resource: R,
  action: (typeof statement)[R][number],
): Promise<boolean> {
  const result = await auth.api.userHasPermission({
    body: { userId, permissions: { [resource]: [action] } },
  });

  return result.success;
}

// A factory, like validateBody(schema): you call it with ONE permission
// and it hands back a middleware that checks exactly that permission.
export function requirePermission<R extends Resource>(
  resource: R,
  action: (typeof statement)[R][number],
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!(await userCan(req.user.userId, resource, action))) {
      return res
        .status(403)
        .json({ error: `Your role may not ${resource}:${action}` });
    }
    next();
  };
}
