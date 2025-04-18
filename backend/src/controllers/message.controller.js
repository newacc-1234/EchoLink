import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import dotenv from "dotenv";
import { getReceiverSocketId, io } from "../lib/socket.js";
dotenv.config();

const chatMemory = {};

const formatBotReply = (reply) => {
    if (!reply || typeof reply !== "string") {
        return "I'm not sure how to respond to that.";
    }
    const cleanReply = reply
        .replace(/^DectraBot\s+says:\s*/i, "")
        .replace(/^undefined/i, "")
        .trim();
    return cleanReply;
};
const generateBotReply =async (userMessage, userId) => {
    try {
        const axios=(await import("axios")).default;

        if (!chatMemory[userId]){
            chatMemory[userId] = [
                {
                    role: "system",
                    content:
                        "You are DectraBot, an intelligent and friendly assistant for the DectraLearnx platform. Answer conversationally and helpfully.",
                },
            ];
        }

        chatMemory[userId].push({
            role: "user",
            content: userMessage,
        });
        //trim memory to last 20 messages
        if (chatMemory[userId].length > 20) {
            chatMemory[userId] = chatMemory[userId].slice(-20);
        }

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "mistralai/mistral-7b-instruct",
                messages: chatMemory[userId],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 
                    "Content-Type": "application/json",
                },
            }
        );

        const botResponse =
            response?.data?.choices?.[0]?.message?.content ?? null;

        if (!botResponse) {
            throw new Error("No valid response from the LLM");
        }

        chatMemory[userId].push({
            role: "assistant",
            content: botResponse,
        });

        return formatBotReply(botResponse);
    } catch (error) {
        console.error("OpenRouter API error:", error.response?.data || error.message);
        return "Sorry, I'm having trouble responding right now.";
    }
};

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        const updatedUsers = users.map(user => {
            if (user.email === "dectrabot@ai.com") {
                return {
                    ...user.toObject(),
                    isVerified: true,
                    isBot: true,
                };
            }
            return {
                ...user.toObject(),
                isVerified: false,
                isBot: false,
            };
        });

        updatedUsers.sort((a, b) => {
            if (a.isBot) return -1;
            if (b.isBot) return 1;
            return 0;
        });

        res.status(200).json(updatedUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        const receiver =await User.findById(receiverId);

        if (receiver.email ==="dectrabot@ai.com") {
            const loadingMessage = new Message({
                senderId: receiver._id,
                receiverId: senderId,
                text: "Typing...",
                createdAt: new Date(),
            });
            await loadingMessage.save();

            const botReplyText = await generateBotReply(text, senderId);

            await Message.findByIdAndDelete(loadingMessage._id);

            const replyMessage = new Message({
                senderId: receiver._id,
                receiverId: senderId,
                text: botReplyText,
            });
            await replyMessage.save();
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage",replyMessage);
            }
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller: ",error.message);
        res.status(500).json({message: "Internal Server Error" });
    }
};
