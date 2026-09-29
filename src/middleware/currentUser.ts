import { Request, Response, NextFunction } from "express";

export function attachCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.user = {
    userId: "6abbfc56fd3bd9ad9ed9e1c4",
    fullName: "Evan Gudmestad",
  };
  next();
}
