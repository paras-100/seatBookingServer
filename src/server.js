// src/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const sequelize = require("./config/database");

dotenv.config(); // Load environment variables

const app = express();

// Use CORS middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://seat-booking-client-vjqj.vercel.app",
    ],
    credentials: true,
  })
);

// Middleware to parse JSON
app.use(express.json());

// Authentication routes
app.use("/api/user", userRoutes);

// Sync database
sequelize
  .sync()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
