// ! cloudinary:-
import cloudinary from "../lib/cloudinary.js";

// ! helper functions for the realtime functionality:-
import { getReceiverSocketId, io } from "../lib/socket.js";

// ! models:-
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const GetUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-passowrd"); // * for the all users except the logged in user

    return res.status(200).json(filteredUser);
  } catch (error) {
    console.error(`Error in get user for sidebar: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const GetMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id; // * senderId
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { receiverId: myId, senderId: userToChatId },
      ],
    });
    return res.status(200).json(messages);
  } catch (error) {
    console.error(`Error in get messages: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const SendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // ! upload base64 image to cloudinary:-
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // ! create a new message:-
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // ? realtime functionality goes here - socket.io:-
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json(newMessage); // * created status code is 201
  } catch (error) {
    console.error(`Error in send message: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
