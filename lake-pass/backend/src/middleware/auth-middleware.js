import jwt from "jsonwebtoken";
import User from "../models/user-model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password").populate("marinaId");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.marinaId = user.marinaId._id || user.marinaId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const requireRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Requires role: ${roles.join(" or ")}` });
  }
  next();
};
