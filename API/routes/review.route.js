import express from "express";
import {
  createReview,
  deleteReview,
  getReviews,
} from "../controllers/review.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createReview);
router.get("/:campaignId", getReviews);
router.delete("/:id", deleteReview);

export default router;
