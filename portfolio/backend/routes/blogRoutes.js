import express from "express";
import multer from "multer";
import path from "path";
import Blog from "../models/Blog.js";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { permitAdmin, permitOwnerOrAdmin } from "../middleware/checkRole.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Get all blogs (public)
router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

// Create blog (logged in user)
router.post("/", protect, upload.single("image"), async (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : "";
  const blog = await Blog.create({
    title,
    content,
    image,
    author: req.userName,
    createdBy: req.userId,
  });
  res.status(201).json(blog);
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update (owner or admin)
router.put("/:id", protect, permitOwnerOrAdmin(Blog), async (req, res) => {
  const updates = req.body;
  const blog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json(blog);
});

// Delete (owner or admin)
router.delete("/:id", protect, permitOwnerOrAdmin(Blog), async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;