import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createGroup,
  getUserGroups,
  updateGroupProfilePicture, 
} from "../controllers/group.controller.js";

const router = express.Router();
router.post("/", protectRoute, createGroup);
router.get("/:userId", protectRoute, getUserGroups);
router.patch("/:groupId/profile-picture", protectRoute, updateGroupProfilePicture);
export default router;
