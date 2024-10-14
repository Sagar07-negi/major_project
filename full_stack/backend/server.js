// Import required modules
const express = require("express");
const cors = require("cors");

const app = express(); // Assuming this model exists and is set up for employees
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI (replace with your actual URI)
const MONGO_URI =
  "mongodb+srv://negis2673:4N6UeISYqANp97Aj@cluster0.vcwrq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const mongoose = require("mongoose");
// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

// Admin Routes
const adminRoutes = require("./routes/admin.js");
const trainerRoutes = require("./routes/trainer.js");

// Register routes
app.use("/admin", adminRoutes);
app.use("/trainer", trainerRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
