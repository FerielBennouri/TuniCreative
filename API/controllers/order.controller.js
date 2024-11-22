import Stripe from "stripe"; // Import Stripe for payment processing
import Campaign from "../models/campaign.model.js"; // Import Campaign model
import Order from "../models/order.model.js"; // Import Order model

// Function to create a payment intent and an order
export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE); // Initialize Stripe with secret key

  // Find the campaign by ID
  const campaign = await Campaign.findById(req.params.id);

  // Create a payment intent in Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: campaign.price * 100,// Stripe requires the amount in cents
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

   // Create a new order in the database
  const newOrder = new Order({
    campaignId: campaign._id,
    img: campaign.cover,
    title: campaign.title,
    buyerId: req.userId,
    creatorId: campaign.userId,
    price: campaign.price,
    payment_intent: paymentIntent.id,
    orderType: "made",
  });

    // Save the order to the database
  await newOrder.save();

    // Send the client secret to the frontend
  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
};

//Function to get all completed orders for the logged-in user
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [{ creatorId: req.userId }, { buyerId: req.userId }],
      isCompleted: true,
    });

    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

// Function to confirm an order based on payment intent
export const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};

// Function to cancel an order
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "cancelled" } },
      { new: true }
    );
    res.status(200).send(order);
  } catch (err) {
    next(err);
  }
};
