import jwt from "jsonwebtoken"; // Library for generating and verifying JSON Web Tokens
import User from "../models/user.model.js"; // User model for interacting with the users collection in MongoDB
import createError from "../utils/createError.js"; // Utility for creating custom error objects

// Middleware function to verify JWT token
export const verifyToken = async (req, res, next) => {
  let token = req.cookies.accessToken; // Get token from cookies

    // If token is not in cookies, get it from headers
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token is provided, return an error
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

    // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_KEY, async (err, user) => {
    if (err) {
      console.log("Token verification failed:", err); // Log the error for debugging
      return next(createError(403, "Token is not valid!"));
    }

    req.userId = user.id; // Add user ID to the request object
    try {
      const currentUser = await User.findById(req.userId);// Find the user by ID
      req.isCreator = currentUser.isCreator; // Add isCreator status to the request object
      next(); // Pass control to the next middleware
    } catch (error) {
      console.log("Error fetching user:", error); // Debugging line
      next(createError(500, "Internal Server Error"));
    }
  });
};
