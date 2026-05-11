import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { permitAdmin } from "../middleware/checkRole.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import Contact from "../models/Contact.js";
import User from "../models/User.js";

const router = express.Router();

// view all blogs
router.get("/blogs", protect, permitAdmin, async (_, res) => {
  const blogs = await Blog.find().populate("createdBy", "name email");
  res.json(blogs);
});

// view all comments
router.get("/comments", protect, permitAdmin, async (_, res) => {
  const comments = await Comment.find()
    .populate("userId", "name email")
    .populate("blogId", "title");
  res.json(comments);
});

// view all messages
router.get("/messages", protect, permitAdmin, async (_, res) => {
  const msgs = await Contact.find();
  res.json(msgs);
});

// view all users
router.get("/users", protect, permitAdmin, async (_, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export default router;