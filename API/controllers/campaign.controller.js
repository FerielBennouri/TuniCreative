import Campaign from "../models/campaign.model.js";
import User from "../models/user.model.js";
import createError from "../utils/createError.js";

// Controller function to create a new campaign
export const createCampaign = async (req, res, next) => {
    // Check if the user is a creator
  if (!req.isCreator) {
    return next(createError(403, "Only creators can create a campaign!"));// Return an error if the user is not a creator
  }
  
  // Create a new campaign object with the user ID and other details from the request body
  const newCampaign = new Campaign({
    userId: req.userId, // Set the userId to the ID of the logged-in user
    ...req.body, // Spread the request body to fill in other campaign details
  });

  try {
    const savedCampaign = await newCampaign.save(); // Save the campaign to the database
    res.status(201).json(savedCampaign); // Respond with the created campaign
  } catch (err) {
    console.error("Error saving campaign:", err);
    if (err.name === "ValidationError") {
    // Handle validation errors
      res
        .status(400)
        .json({ message: "Validation Error", details: err.errors }); // Handle validation errors
    } else {
      next(err);// Handle errors
    }
  }
};

// Controller function to delete a campaign
export const deleteCampaign = async (req, res, next) => {
  try {
     // Find the campaign by its ID
    const campaign = await Campaign.findById(req.params.id);
    if (campaign.userId !== req.userId)
      // Ensure the user can only delete their own campaigns
      return next(createError(403, "You can delete only your campaign!")); 

      // Delete the campaign from the database
    await Campaign.findByIdAndDelete(req.params.id); // Delete the campaign
    res.status(200).send("Campaign has been deleted!");
  } catch (err) {
    next(err);// Handle errors
  }
};

// Controller function to get a single campaign
export const getCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);// Find the campaign by ID
    if (!campaign) {
      return next(createError(404, "Campaign not found!")); // Handle case where campaign is not found
    }
    res.status(200).json(campaign);// Respond with the found campaign object
  } catch (err) {
    next(err);// Handle errors
  }
};

// Controller function to get all campaigns
export const getCampaigns = async (req, res, next) => {
  const q = req.query;
  // Build filters object based on query parameters
  const filters = {
    ...(q.userId && { userId: q.userId }),// Filter by user ID if provided
    ...(q.cat && { cat: q.cat }),// Filter by category if provided
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }), // Filter by minimum price if provided
        ...(q.max && { $lt: q.max }), // Filter by maximum price if provided
      },
    }),
  };

  try {
    // Find campaigns with filters and sort
    let campaigns = await Campaign.find(filters).sort({ [q.sort]: -1 });

    if (q.search) {
      const creators = await User.find({
        username: { $regex: q.search, $options: "i" },// Search for creators by username
      }).select("_id");

      const creatorIds = creators.map((creator) => creator._id.toString());

      const campaignMatches = await Campaign.find({
        $or: [
          { title: { $regex: q.search, $options: "i" } },// Search for campaigns by title
          { desc: { $regex: q.search, $options: "i" } }, // Search for campaigns by description
          { userId: { $in: creatorIds } },  // Search for campaigns by creator ID
        ],
      });

      // Merge and remove duplicates from the search results
      const mergedCampaigns = [...new Set([...campaigns, ...campaignMatches.map(c => c._id.toString())])];
      campaigns = campaigns.filter(c => mergedCampaigns.includes(c._id.toString()));
    }

    res.status(200).send(campaigns); // Respond with the campaigns
  } catch (err) {
    next(err);// Handle errors
  }
};
