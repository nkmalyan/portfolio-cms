import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// 🧩 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, age, profession, secretCode } = req.body;
    if (!name || !email || !password || !age || !profession)
      return res.status(400).json({ message: "All fields required" });

    if (age < 15) return res.status(400).json({ message: "Age must be 15+" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // 🔒 admin only if details exactly match .env
    let role = "user";
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD &&
      secretCode === process.env.ADMIN_SECRET
    ) {
      role = "admin";
    }

    const user = await User.create({
      name,
      email,
      password: hashed,
      age,
      profession,
      role,
    });

    res.status(201).json({
      message: "Registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🧩 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    // prevent fake admins
    if (user.role === "admin" && email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "Unauthorized admin access" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;