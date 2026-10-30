import { Request, Response, NextFunction } from "express";
import { suggestService } from "../agent/assistant.js";
import {
  isRateLimited,
  isUnusableAnswer,
  retryAfterSeconds,
} from "../agent/groqErrors.js";
import type { AssistantInput } from "../schemas/assistantSchemas.js";

export async function suggest(req: Request, res: Response, next: NextFunction) {
  try {
    const suggestion = await suggestService(req.body as AssistantInput);
    res.status(200).json({ suggestion });
  } catch (err) {
    if (isRateLimited(err)) {
      const seconds = retryAfterSeconds(err);
      res.set("Retry-After", String(seconds));
      res.status(429).json({
        error: `The assistant is busy. Try again in ${seconds} seconds.`,
      });
      return;
    }
    if (isUnusableAnswer(err)) {
      res.status(502).json({
        error: "The assistant gave an answer I could not use. Try again.",
      });
      return;
    }
    next(err);
  }
}
