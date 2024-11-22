import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the Campaign schema
const CampaignSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,// User ID of the creator
    },
    title: {
      type: String,
      required: true,// Title of the campaign
    },
    desc: {
      type: String,
      required: true,
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    starNumber: {
      type: Number,
      default: 0, // Number of star ratings
    },
    cat: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    cover: {
      type: String,
      required: true, // Cover image URL
    },
    images: {
      type: [String],
      required: false, // Additional image URLs
    },
    shortTitle: {
      type: String,
      required: true,
    },
    shortDesc: {
      type: String,
      required: true,
    },
    deliveryTime: {
      type: Number,
      required: true, // Delivery time in days
    },
    revisionNumber: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      required: false,
    },
    sales: {
      type: Number,
      default: 0, // Number of sales
    },
  },

  {
    timestamps: true,// Automatically manage createdAt and updatedAt timestamps
  }
);

export default mongoose.model("Campaign", CampaignSchema); // Export the Campaign model
