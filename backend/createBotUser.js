import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/user.model.js";

dotenv.config();

const createBotUser =async()=> {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const existing = await User.findOne({ email:"dectrabot@ai.com" });
    if (existing) {
      console.log("DectraBot already exists.");
    } else {
      await User.create({
        email: "dectrabot@ai.com",
        fullName: "DectraBot",
        password: "bot_password", //dummy value
        profilePic: "", //optional
      });
      console.log("DectraBot created!");
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.disconnect();
  }
};

createBotUser();
