import express from "express";// Library for creating an Express application
import { register, login, logout } from "../controllers/auth.controller.js"; // Import controller functions


const router = express.Router();// Create a new router

// Define routes for user authentication
router.post("/register",register); // Route for user registration
router.post("/login",login); // Route for user login
router.post("/logout",logout); // Route for user logout

export default router; // Export the router