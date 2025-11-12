import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import contactLensRoutes from "./routes/contactLensRoutes.js";
import allProductsRoutes from "./routes/allProductsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Vite dev server URL
  credentials: true
}));

app.use(express.json());

// Environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

// Debug: Log environment variables (remove in production)
console.log('Environment variables loaded:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- MONGO_URI:', process.env.MONGO_URI ? '*** MongoDB URI set ***' : '❌ MONGO_URI not found');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '*** JWT Secret set ***' : '❌ JWT_SECRET not found');

// Check essential environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ Missing MONGO_URI in backend/.env");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET in backend/.env");
  process.exit(1);
}
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in backend/.env");
  process.exit(1);
}

// Connect to MongoDB
console.log('\nAttempting to connect to MongoDB...');
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout
  connectTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000, // 45 seconds
};

mongoose
  .connect(process.env.MONGO_URI, mongoOptions)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => {
    console.error("\n❌ MongoDB connection failed:");
    console.error('- Error name:', err.name);
    console.error('- Error message:', err.message);
    console.error('\nTroubleshooting steps:');
    console.log('1. Verify your MongoDB Atlas cluster is running');
    console.log('2. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('3. Verify your connection string in .env file');
    console.log('4. Check your internet connection');
    process.exit(1);
  });

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/contact-lenses", contactLensRoutes);
app.use("/api/all-products", allProductsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});
