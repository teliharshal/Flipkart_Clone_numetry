const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes"); // Product routes
const userRoutes = require("./routes/userRoute"); // User routes

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Connect routes
app.use("/api/products", productRoutes); // Product Management
app.use("/api/users", userRoutes); // User Management

// ✅ Database Connection
mongoose
  .connect("mongodb://localhost:27017/sample_mflix", {
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
