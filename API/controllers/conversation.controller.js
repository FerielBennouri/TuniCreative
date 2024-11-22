// conversation.controller.js
import Conversation from "../models/conversation.model.js";
import createError from "../utils/createError.js";
import User from "../models/user.model.js";

// Function to handle conversation creation
export const createConversation = async (req, res, next) => {
  // Prevent creating a conversation with oneself
  if (req.body.from === req.body.to) {
    return next(
      createError(400, "Sender and receiver cannot be the same user.")
    );
  }

  try {
    console.log(req.body.id);
    // Check if a conversation already exists
    const existingConversation = await Conversation.findOne({
      id: req.body.id,
    });

    if (existingConversation) {
       // If conversation exists, return it
      return res.status(200).send(existingConversation);
    }

     // Retrieve user information for both participants
    const fromUser = await User.findById(req.body.from);
    const toUser = await User.findById(req.body.to);
    if (!fromUser || !toUser) {
      return next(createError(404, "User not found"));
    }
    // Create a new conversation if it doesn't exist
    const newConversation = new Conversation({
      id: req.body.id,
      senderId: req.body.from,
      senderName: fromUser.username,
      receiverId: req.body.to,
      receiverName: toUser.username,
      readBySender: true,
      readByReceiver: false,
    });

     // Save the new conversation
    const savedConversation = await newConversation.save();
    res.status(201).send(savedConversation);
  } catch (err) {
    next(err);
  }
};

// Function to update conversation read status
export const updateConversation = async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const userId = req.userId;
    console.log(userId);
    console.log("conversationId", conversationId);

    // Find the conversation based on conversationId
    const conversation = await Conversation.findOne({ id: conversationId });
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    let updateFields = {};
    if (userId === conversation.senderId) {
      // Update readBySender if the current user is the sender
      console.log("sender id match");
      updateFields = { readBySender: true };
    } else if (userId === conversation.receiverId) {
      // Update readByReceiver if the current user is the receiver
      updateFields = { readByReceiver: true };
    } else {
      // If the current user is neither sender nor receiver, return unauthorized
      return res
        .status(403)
        .json({ message: "Unauthorized to update conversation" });
    }

    console.log(updateFields);

    // Update the conversation in the database without updating the timestamp
    const updatedConversation = await Conversation.findOneAndUpdate(
      { id: conversationId },
      { $set: updateFields },
      { new: true, timestamps: false }
    );

    if (!updatedConversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json({
      message: "Conversation updated successfully",
      conversation: updatedConversation,
    });
  } catch (err) {
    next(err);
  }
};

// Function to get a single conversation
export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ id: req.params.id });
    if (!conversation) {
      return next(createError(404, "Conversation not found"));
    }
    res.status(200).send(conversation);
  } catch (err) {
    next(err);
  }
};

// Function to get all conversations for a user
export const getConversations = async (req, res, next) => {
  try {
    // Find conversations where the user is either the sender or receiver
    const conversations = await Conversation.find({
      $or: [{ senderId: req.userId }, { receiverId: req.userId }],
    }).sort({ updatedAt: -1 });

    res.status(200).send(conversations);
  } catch (err) {
    next(err);
  }
};
