// controllers/messageController.js

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// Create a new message
export const createMessage = async (req, res, next) => {
  const { conversationId, desc } = req.body;
  const userId = req.userId;

  try {
    // Save a new message
    const newMessage = new Message({
      conversationId,
      userId,
      desc,
    });

    const savedMessage = await newMessage.save();

    // Find the conversation
    const conversation = await Conversation.findOne({ id: conversationId });
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    let updateFields = {
      lastMessage: desc,
    };

    if (userId === conversation.senderId) {
      // Update readByReceiver if the current user is the sender
      updateFields.readByReceiver = false;
    } else if (userId === conversation.receiverId) {
      // Update readBySender if the current user is the receiver
      updateFields.readBySender = false;
    } else {
      // If the current user is neither sender nor receiver, return unauthorized
      return res
        .status(403)
        .json({ message: "Unauthorized to update conversation" });
    }

    // Update conversation
    await Conversation.findOneAndUpdate(
      { id: conversationId },
      { $set: updateFields },
      { new: true }
    );

    res.status(201).json(savedMessage);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Get all messages for a specific conversation
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id });
    // Find the conversation
    const conversation = await Conversation.findOne({ id: req.params.id });
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    let updateFields = {};

    if (req.userId === conversation.senderId) {
      // Update readBySender if the current user is the sender
      updateFields.readBySender = true;
    } else if (req.userId === conversation.receiverId) {
      // Update readByReceiver if the current user is the receiver
      updateFields.readByReceiver = true;
    } else {
      // If the current user is neither sender nor receiver, return unauthorized
      return res
        .status(403)
        .json({ message: "Unauthorized to update conversation" });
    }

    // Update conversation
    await Conversation.findOneAndUpdate(
      { id: req.params.id },
      { $set: updateFields },
      { new: true }
    );

    // Fetch user data for each message
    const messagesWithUserDetails = await Promise.all(
      messages.map(async (message) => {
        const user = await User.findById(message.userId);
        return {
          ...message.toObject(),
          user: {
            username: user.username,
            img: user.img,
          },
        };
      })
    );

    res.status(200).json(messagesWithUserDetails);
  } catch (err) {
    console.log(err);
    next(err);
  }
};