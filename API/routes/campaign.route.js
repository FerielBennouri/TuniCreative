import express from "express";
import {
  createCampaign,
  deleteCampaign,
  getCampaign,
  getCampaigns,
} from "../controllers/campaign.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();
// Route to create a campaign (requires authentication)
router.post("/", verifyToken, createCampaign);

// Route to delete a campaign (requires authentication)
router.delete("/:id", verifyToken, deleteCampaign);

// Route to get a single campaign by ID
router.get("/single/:id", getCampaign);

// Route to get all campaigns with optional filters
router.get("/", getCampaigns);

export default router;
