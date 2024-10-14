// models/Employee.js

const mongoose = require('mongoose'); // Import mongoose for MongoDB interactions

// Define the Employee schema
const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String, // Unique identifier for the employee
        required: true, // This field is required
        unique: true, // Must be unique across all documents
    },
    name: {
        type: String, // Employee's name
        required: true, // This field is required
    },
    email: {
        type: String, // Employee's email address
        required: true, // This field is required
        unique: true, // Must be unique across all documents
    },
    phone: {
        type: String, // Employee's phone number
        required: true, // This field is required
    },
    address: {
        type: String, // Employee's address
        required: true, // This field is required
    },
    designation: {
        type: String, // Employee's job title or designation
        required: true, // This field is required
    },
    gender: {
        type: String, // Employee's gender
        enum: ['Male', 'Female', 'Other'], // Specify valid values
        required: true, // This field is required
    },
    dateOfJoining: {
        type: Date, // Date when the employee joined
        required: true, // This field is required
    },
});

// Create and export the Employee model using the defined schema
module.exports = mongoose.model('Employee', employeeSchema);
