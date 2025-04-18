import Group from "../models/group.model.js";
import cloudinary from "../lib/cloudinary.js";

//create a new group
export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const ownerId = req.user._id;

    if (!name || !members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: "Group name and members are required" });
    }

    //ensure unique member list including owner
    const uniqueMembers = [...new Set([...members, ownerId.toString()])];

    const group = new Group({
      name,
      members: uniqueMembers,
      owner: ownerId,
    });

    await group.save();

    res.status(201).json(group);
  } catch (error) {
    console.error("Error in createGroup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get all groups for a specific user
export const getUserGroups = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const groups = await Group.find({ members: userId }).populate("members", "-password");

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error in getUserGroups:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//update group profile picture
export const updateGroupProfilePicture = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { image } = req.body;
    const userId = req.user._id;

    if (!image) return res.status(400).json({ message: "No image provided" });

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    //only allow group owner to update the picture
    if (group.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the group owner can update the profile picture" });
    }

    const uploadResponse = await cloudinary.uploader.upload(image);

    group.groupImage = uploadResponse.secure_url;
    await group.save();

    const populatedGroup = await Group.findById(groupId).populate("members", "-password");

    res.status(200).json(populatedGroup);
  } catch (error) {
    console.error("Error in updateGroupProfilePicture:", error.message);
    res.status(500).json({ message: "Failed to update group profile picture" });
  }
};
