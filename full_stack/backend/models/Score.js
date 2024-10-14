// models/Score.js

const mongoose = require('mongoose'); // Import mongoose for MongoDB interactions

// Define the Score schema
const scoreSchema = new mongoose.Schema({
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId, // Reference to Employee model
        ref: 'Employee', // Name of the referenced model
        required: true, // This field is required
    },
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, // Reference to Course model
        ref: 'Course', // Name of the referenced model
        required: true, // This field is required
    },
    score: { 
        type: Number, // The score received by the employee
        required: true, // This field is required
        min: 0, // Minimum score
        max: 10, // Maximum score
    },
    feedback: {
        discipline: { 
            type: Number, // Feedback score for discipline
            min: 0, // Minimum feedback score
            max: 5, // Maximum feedback score
        },
        punctuality: { 
            type: Number, // Feedback score for punctuality
            min: 0, // Minimum feedback score
            max: 5, // Maximum feedback score
        },
        Leadership: { 
            type: Number, // Feedback score for leadership
            min: 0, // Minimum feedback score
            max: 5, // Maximum feedback score
        },
        communication: { 
            type: Number, // Feedback score for communication
            min: 0, // Minimum feedback score
            max: 5, // Maximum feedback score
        },
    },
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// Ensure unique combination of employeeId and courseId
scoreSchema.index({ employeeId: 1, courseId: 1 }, { unique: true }); // Prevent duplicate scores for the same employee and course

// Create and export the Score model using the defined schema
const Score = mongoose.model('Score', scoreSchema);
module.exports = Score;
