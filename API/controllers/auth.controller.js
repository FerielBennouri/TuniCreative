import bcrypt from "bcrypt"; // Library for hashing passwords
import jwt from "jsonwebtoken";  // Library for generating and verifying JSON Web Tokens
import User from "../models/user.model.js"; // User model for interacting with the users collection in MongoDB
import createError from "../utils/createError.js";// Utility for creating custom error objects

// Function to handle user registration
export const register = async (req, res, next) => {
  try {
    // Normalize email and username to lowercase
    const email = req.body.email.toLowerCase();
    const username = req.body.username.toLowerCase();
    
    // Check if the email already exists in the database
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Check if the username already exists in the database
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username already exists." });
    }

        // Hash the password using bcrypt with a salt factor of 5
    const hash = bcrypt.hashSync(req.body.password, 5); // 5 is a salt for the hashing and it can be any number
       // Create a new user object with the hashed password and other details from the request body
    const newUser = new User({
      ...req.body,
      email,
      username,
      password: hash,
    });

    // Save the new user to the database
    await newUser.save();
    res.status(201).send("User has been created."); // Send a success response
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ message: "Internal Server Error" });  // Send an error response
  }
};

export const login = async (req, res, next) => {
  try {
    // Convert username to lowercase to ensure case-insensitivity
    const username = req.body.username.toLowerCase();
    
    // Find the user by username in the database
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found!" });

    // Compare the provided password with the stored hashed password
    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return res.status(400).json({ message: "Wrong password or username!" });
    
    // Generate a JWT token with the user ID and role (isCreator)
    const token = jwt.sign(
      {
        id: user._id,
        isCreator: user.isCreator,
      },
      process.env.JWT_KEY // Secret key for signing the token
    );
    
    // Extract user information excluding the password
    const { password, ...info } = user._doc;
    
    // Set the token as an HTTP-only cookie and send user information and token in the response
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send({ ...info, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" }); // Send an error response

  }
};

// Function to handle user logout
export const logout = async (req, res) => {
    // Clear the JWT token from the cookies
  res
    .clearCookie("accessToken", {
      sameSite: "none", // we are doing this because our backend server URL and the URL of the React application are not the same
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};
