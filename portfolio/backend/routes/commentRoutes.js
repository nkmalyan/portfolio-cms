import express from "express";
import Comment from "../models/Comment.js";
import { protect } from "../middleware/authMiddleware.js";
import { permitOwnerOrAdmin } from "../middleware/checkRole.js";

const router = express.Router();

// Fetch comments for a blog
router.get("/:blogId", async (req, res) => {
  const comments = await Comment.find({ blogId: req.params.blogId }).sort({ createdAt: -1 });
  res.json(comments);
});

// Add comment (logged in)
router.post("/:blogId", protect, async (req, res) => {
  const newComment = await Comment.create({
    blogId: req.params.blogId,
    userId: req.userId,
    userName: req.userName,
    message: req.body.message,
  });
  res.status(201).json(newComment);
});

// Delete comment (owner or admin)
router.delete("/:id", protect, permitOwnerOrAdmin(Comment), async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ message: "Comment deleted" });
});

export default router;