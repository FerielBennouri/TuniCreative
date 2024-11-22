import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the schema for an Order
const OrderSchema = new Schema(
  {
    campaignId: {
      type: String, // ID of the related campaign
      required: true,
    },
    img: {
      type: String,// URL of the campaign image
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    creatorId: {
      type: String, // ID of the campaign creator
      required: true,
    },
    buyerId: {
      type: String, // ID of the buyer
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    payment_intent: {
      type: String, // Stripe payment intent ID
      required: true,
    },
    orderType: {
      type: String, // Type of order (received or made)
      enum: ["received", "made"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled"], //Order status (active or cancelled)
      default: "active",
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
  }
);

export default mongoose.model("Order", OrderSchema);
