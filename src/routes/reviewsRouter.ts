import { Router, type Request } from "express";
import { ObjectId } from "mongodb";
import { validateBody } from "../middleware/validate.js";
import { getProvidersCollection } from "../db.js";
import { createReviewSchema } from "../schemas/reviewSchema.js";
import { randomUUID } from "crypto";
import { attachCurrentUser } from "../middleware/currentUser.js";

export const reviewsRouter = Router({ mergeParams: true }); //mergeParams: true allows us to access the providerId from the parent route

// POST /providers/:id/reviews — $push a new review onto the array
reviewsRouter.post(
  "/",
  attachCurrentUser,
  validateBody(createReviewSchema),
  async (req, res, next) => {
    try {
      const review = {
        _id: randomUUID(),
        ...req.body,
        createdAt: new Date(),
        author: req.user,
      };

      res.json(
        await getProvidersCollection().findOneAndUpdate(
          { _id: new ObjectId(req.params.id as string) },
          { $push: { reviews: review } },
          { returnDocument: "after" },
        ),
      );
    } catch (err) {
      next(err);
    }
  },
);

// DELETE /providers/:id/reviews/:reviewId — $pull that one review back out
reviewsRouter.delete(
  "/:reviewId",
  async (req: Request<{ id: string; reviewId: string }>, res, next) => {
    try {
      await getProvidersCollection().findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $pull: { reviews: { _id: req.params.reviewId } } },
      );
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);
