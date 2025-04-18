import GroupMessage from "../models/groupMessage.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";

export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    let imageUrl = null;

    //upload image if provided
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    //create and save the new message
    const newMessage = new GroupMessage({
      groupId,
      senderId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    //emit real-time event to all users in the group room
    io.to(groupId).emit("newGroupMessage", newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendGroupMessage:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    //fetch and sort messages by creation time
    const messages = await GroupMessage.find({ groupId}).sort({createdAt: 1});
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getGroupMessages:", error.message);
    res.status(500).json({message: "Internal Server Error" });
  }
};
