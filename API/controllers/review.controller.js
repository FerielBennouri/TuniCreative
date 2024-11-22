import Campaign from "../models/campaign.model.js";
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";
import createError from "../utils/createError.js";

export const createReview = async (req, res, next) => {
  try {
    // Check if the user has purchased the campaign
    const order = await Order.findOne({
      campaignId: req.body.campaignId,
      buyerId: req.userId,
      isCompleted: true,
    });

    if (!order) {
      return next(
        createError(403, "You can only review campaigns you have purchased.")
      );
    }

    const review = await Review.findOne({
      campaignId: req.body.campaignId,
      userId: req.userId,
    });

    if (review) {
      return next(
        createError(403, "You have already created a review for this campaign!")
      );
    }

    const newReview = new Review({
      userId: req.userId,
      campaignId: req.body.campaignId,
      desc: req.body.desc,
      star: req.body.star,
    });

    const savedReview = await newReview.save();

    await Campaign.findByIdAndUpdate(req.body.campaignId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });

    res.status(201).send(savedReview);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ campaignId: req.params.campaignId });
    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).send("Review has been deleted.");
  } catch (err) {
    next(err);
  }
};
