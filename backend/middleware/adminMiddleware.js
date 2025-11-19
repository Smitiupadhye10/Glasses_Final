import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const adminAuth = async (req, res, next) => {
  try {
    console.log('🔐 adminAuth called');
    const token = req.headers.authorization?.split(" ")[1];
    console.log('🔍 Token found:', !!token);
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔍 Decoded user ID:', decoded.id);
    const user = await User.findById(decoded.id);
    console.log('🔍 User found:', !!user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

