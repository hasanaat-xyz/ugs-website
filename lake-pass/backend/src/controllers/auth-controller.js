import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user-model.js";
import Marina from "../models/marina-model.js";

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  try {
    const { name, email, password, marinaSlug } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    let marina;
    if (marinaSlug) {
      marina = await Marina.findOne({ slug: marinaSlug });
      if (!marina) return res.status(404).json({ message: "Marina not found" });
    } else {
      return res.status(400).json({ message: "marinaSlug required for registration" });
    }

    const userCount = await User.countDocuments({ marinaId: marina._id });
    const role = userCount === 0 ? "owner" : "staff";

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      marinaId: marina._id,
    });

    const token = signToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        marinaId: user.marinaId,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("marinaId");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        marinaId: user.marinaId,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password").populate("marinaId");
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    marinaId: user.marinaId,
  });
};

export const logout = (_req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
