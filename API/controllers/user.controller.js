import User from "../models/user.model.js"; // User model for interacting with the users collection in MongoDB
import createError from "../utils/createError.js"; // Utility for creating custom error objects

// Function to delete a user account
export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  // Check if the authenticated user ID matches the user ID to be deleted
  if (req.userId !== user._id.toString()) {
    return next(createError(403, "You can delete only your account!"));
  }

   // Delete the user from the database
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("Deleted."); // Send a success response
};

// Function to get user information
export const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);// Find the user by ID from the request parameters
  res.status(200).send(user); // Send the user information as a response
};

// Function to make a user a creator
export const becomeCreator = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);// Find the authenticated user by ID
    if (!user) {
      return next(createError(404, "User not found!")); // Send an error if user is not found
    }

    user.isCreator = true; // Set the isCreator field to true
    await user.save(); // Save the updated user to the database

    res.status(200).send("User is now a creator."); // Send a success response
  } catch (err) {
    next(err); // Pass the error to the next middleware
  }
};
