// Provided file: copy it in as it is. You do not need to change it.
//
// When Groq (or the model) has a problem, the AI SDK throws an error object
// with a few fields. These three helpers read those fields so the
// controller can ask simple yes/no questions.
import { APICallError, NoObjectGeneratedError } from "ai";

// Groq answers 429 when we ask too often.
export function isRateLimited(err: unknown): boolean {
  return APICallError.isInstance(err) && err.statusCode === 429;
}

// Groq says how long to wait in a "retry-after" header (seconds).
// If it is missing, wait a minute.
export function retryAfterSeconds(err: unknown): number {
  const header = APICallError.isInstance(err)
    ? err.responseHeaders?.["retry-after"]
    : undefined;
  const seconds = Number(header);
  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : 60;
}

// True when the model gave an answer we cannot use:
// - its answer did not match our schema, or
// - it replied in plain words instead of calling a tool, which Groq
//   reports as 400 "tool_use_failed".
export function isUnusableAnswer(err: unknown): boolean {
  if (NoObjectGeneratedError.isInstance(err)) return true;
  return (
    APICallError.isInstance(err) &&
    err.statusCode === 400 &&
    String(err.responseBody).includes("tool_use_failed")
  );
}
