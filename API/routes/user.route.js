import express from "express"; // Library for creating an Express application
import { // Import controller functions
  becomeCreator,
  deleteUser,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";// Import JWT verification middleware

const router = express.Router(); // Create a new router
router.delete("/:id", verifyToken, deleteUser); // Route for deleting a user, protected by JWT verification
router.get("/:id", getUser); // Route for getting user information
router.post("/become-creator", verifyToken, becomeCreator); // Route for making a user a creator, protected by JWT verification

export default router; // Export the router
