const mongoose = require('mongoose'); // Import mongoose for MongoDB interactions

// Define the Course schema
const CourseSchema = new mongoose.Schema({
    courseId: { type: Number, required: true }, // Unique identifier for the course (changed from String to Number)
    name: { type: String, required: true }, // Name of the course
    description: { type: String, required: true }, // Description of the course
    startDate: { type: Date, required: true }, // Course start date
    endDate: { type: Date, required: true }, // Course end date
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' }, // Reference to the Trainer model
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }], // Array of references to the Employee model
});

// Create the Course model using the defined schema
const Course = mongoose.model('Course', CourseSchema);

// Export the Course model for use in other parts of the application
module.exports = Course;
