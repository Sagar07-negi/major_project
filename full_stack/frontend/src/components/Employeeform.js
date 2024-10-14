// src/components/EmployeeForm.js

import React, { useState } from 'react'; 
import axios from 'axios'; 
import { AiOutlineClose } from 'react-icons/ai'; 

// EmployeeForm component for adding a new employee
const EmployeeForm = ({ onAdd, onClose }) => {
    // State variables for form fields
    const [name, setName] = useState(''); // Employee name
    const [email, setEmail] = useState(''); // Employee email
    const [phone, setPhone] = useState(''); // Employee phone number
    const [address, setAddress] = useState(''); // Employee address
    const [designation, setDesignation] = useState(''); // Employee designation
    const [gender, setGender] = useState(''); // Employee gender
    const [dateOfJoining, setDateOfJoining] = useState(''); // Employee date of joining

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            // Send a POST request to add a new employee
            const response = await axios.post('http://localhost:5000/admin/add-employee', {
                name,
                email,
                phone,
                address,
                designation,
                gender,
                dateOfJoining,
            });

            // Call onAdd callback to update employee list with the new employee
            onAdd(response.data.employee);
            alert(response.data.message); // Show success message
            // Reset form fields after successful submission
            setName('');
            setEmail('');
            setPhone('');
            setAddress('');
            setDesignation('');
            setGender('');
            setDateOfJoining('');
            onClose(); // Close the form
        } catch (error) {
            console.error('Error adding employee:', error); // Log error to console
            alert('Failed to add employee. Please try again.'); // Show error message
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form"> {/* Form element with submit handler */}
            <div className="form-header"> {/* Header for the form */}
                <h2>Add Employee</h2> {/* Title for the form */}
                <AiOutlineClose className="close-icon" onClick={onClose} /> {/* Close icon to exit form */}
            </div>
            {/* Input fields for employee details */}
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)} // Update name state on change
                required // Required field
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state on change
                required // Required field
            />
            <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)} // Update phone state on change
                required // Required field
            />
            <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)} // Update address state on change
                required // Required field
            />
            <input
                type="text"
                placeholder="Designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)} // Update designation state on change
                required // Required field
            />
            {/* Gender Dropdown */}
            <select
                value={gender}
                onChange={(e) => setGender(e.target.value)} // Update gender state on change
                required // Required field
            >
                <option value="">Select Gender</option> {/* Placeholder option */}
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            <input
                type="date"
                placeholder="Date of Joining"
                value={dateOfJoining}
                onChange={(e) => setDateOfJoining(e.target.value)} // Update date of joining state on change
                required // Required field
            />
            <button type="submit">Add Employee</button> {/* Submit button */}
        </form>
    );
};

export default EmployeeForm; // Export the EmployeeForm component
