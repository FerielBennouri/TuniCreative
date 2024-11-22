import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getOrders, intent, confirm, cancelOrder } from "../controllers/order.controller.js";

const router = express.Router();

// Define routes for order operations
router.get("/", verifyToken, getOrders); // Get all completed orders for the user
router.post("/create-payment-intent/:id", verifyToken, intent);// Create a payment intent for a campaign
router.put("/", verifyToken, confirm); // Confirm an order
router.put("/cancel/:id", verifyToken, cancelOrder); // Cancel an order

export default router;
