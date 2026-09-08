import { Request, Response, NextFunction } from "express";
import debug from "debug";

const logger = debug("lawnconnect:logger");

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  logger(`${req.method} ${req.url}`);
  next();
}
