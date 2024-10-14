// models/Trainer.js

const mongoose = require('mongoose'); // Import mongoose for MongoDB interactions

// Define the Trainer schema
const trainerSchema = new mongoose.Schema({
    trainerId: {
        type: Number, // Unique identifier for the trainer
        required: true, // This field is required
        unique: true, // Ensure this trainerId is unique across the collection
    },
    name: {
        type: String, // Trainer's name
        required: true, // This field is required
    },
    email: {
        type: String, // Trainer's email address
        required: true, // This field is required
        unique: true, // Ensure no duplicate emails exist in the collection
    },
    phone: {
        type: String, // Trainer's phone number
        required: true, // This field is required
    },
    expertise: {
        type: String, // Area of expertise for the trainer
        required: true, // This field is required
    },
    courses: [{ 
        type: mongoose.Schema.Types.ObjectId, // Reference to the Course model
        ref: 'Course' // Name of the referenced model
    }]
});

// Create the Trainer model using the defined schema
const Trainer = mongoose.model('Trainer', trainerSchema);

// Export the Trainer model for use in other parts of the application
module.exports = Trainer;
