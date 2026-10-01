import * as z from "zod";

const reviewFields = z.strictObject({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const createReviewSchema = reviewFields;

export const updateReviewSchema = reviewFields
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
