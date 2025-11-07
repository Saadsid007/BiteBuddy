const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. Define a Mongoose Schema and Model ---
const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  person: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  message: { type: String },
});

const Reservation = mongoose.model("Reservation", reservationSchema);

// --- 2. Connect to MongoDB and Start the Server ---
// Replace the URI with your own MongoDB connection string
const MONGO_URI = "mongodb://localhost:27017/reservation_app";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
  });

// --- 3. Update API Endpoints ---

// POST route to insert a reservation
app.post("/api/reserve", async (req, res) => {
  try {
    const newReservation = new Reservation(req.body);
    await newReservation.save();
    res.status(200).json({ success: true, message: "Reservation successful ✅" });
  } catch (error) {
    console.error("Error inserting reservation:", error);
    // Provide more specific error for validation issues
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: "An internal server error occurred." });
  }
});

// GET route to fetch all reservations
app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json({ success: true, data: reservations });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ success: false, error: "An internal server error occurred." });
  }
});