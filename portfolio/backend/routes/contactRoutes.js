import express from "express";
import Contact from "../models/Contact.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 SECURED: Submit contact form (Only logged-in users)
router.post("/", protect, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const contact = await Contact.create({ name, email, message });
    res.status(201).json({ message: "Message sent successfully!", contact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔒 SECURED: Get all messages (Admin dashboard view)
router.get("/", protect, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔒 SECURED: Delete message
router.delete("/:id", protect, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;