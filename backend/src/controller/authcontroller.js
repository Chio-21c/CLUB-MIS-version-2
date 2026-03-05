import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { signToken } from "../config/jwt.js";

// Signup (create user)
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email exists
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    // Hash password for security...
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, passwordHash });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Compare password
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT
    const token = signToken({ id: user.id, name: user.name });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};