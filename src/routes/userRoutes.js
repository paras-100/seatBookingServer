// src/routes/auth.js
const express = require("express");
const { signup, login } = require("../controllers/authControllers"); // Updated path
const {
  sendSeatsData,
  seatBooking,
  resetBooking,
} = require("../controllers/bookingController");

const router = express.Router();

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

// Get seats data
router.get("/getSeatsData", sendSeatsData);

// Book seats
router.put("/bookSeats", seatBooking);

// Reset booking
router.put("/resetSeats", resetBooking);

module.exports = router;
