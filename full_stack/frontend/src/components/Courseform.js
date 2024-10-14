import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';

// CourseForm component for adding a new course
const CourseForm = ({ onAdd, onClose }) => {
    // State variables for form fields
    const [courseId, setCourseId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [trainerId, setTrainerId] = useState('');
    const [trainers, setTrainers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    // Fetch employees and trainers data when the component mounts
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:5000/admin/employees');
                setEmployees(response.data); // Set employees in state
            } catch (error) {
                console.error('Error fetching employees:', error); // Log error if fetching fails
            }
        };

        const fetchTrainers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/admin/trainers');
                setTrainers(response.data); // Set trainers in state
            } catch (error) {
                console.error('Error fetching trainers:', error); // Log error if fetching fails
            }
        };

        fetchEmployees(); // Call to fetch employees
        fetchTrainers(); // Call to fetch trainers
    }, []);

    // Toggle employee selection for the course
    const handleEmployeeChange = (employeeId) => {
        setSelectedEmployees((prevSelected) => {
            if (prevSelected.includes(employeeId)) {
                // Remove employee if already selected
                return prevSelected.filter((id) => id !== employeeId);
            } else {
                // Add employee if not selected
                return [...prevSelected, employeeId];
            }
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Create course data object
        const courseData = {
            courseId,
            name,
            description,
            startDate,
            startTime,
            endDate,
            endTime,
            trainerId,
            employees: selectedEmployees // Include the selected employees
        };

        try {
            const response = await axios.post('http://localhost:5000/admin/add-course', courseData);
            alert(response.data.message); // Show success message
            onAdd(); // Call the onAdd function to refresh the course list
            resetForm(); // Reset form fields after successful submission
        } catch (error) {
            console.error('Error adding course:', error.response ? error.response.data : error); // Log error
            alert(`Error adding course: ${error.response ? error.response.data.message : error.message}`); // Show error message
        }
    };

    // Reset form fields to initial state
    const resetForm = () => {
        setCourseId('');
        setName('');
        setDescription('');
        setStartDate('');
        setStartTime('');
        setEndDate('');
        setEndTime('');
        setTrainerId('');
        setSelectedEmployees([]);
    };

    return (
        <form onSubmit={handleSubmit} className="courseform form">
            <div className="form-header">
                <h2>Add Course</h2>
                <AiOutlineClose className="close-icon" onClick={onClose} /> {/* Close icon to exit form */}
            </div>
            <div className='courseformdiv'>
                <div>
                    <input
                        type="number"
                        placeholder="Course ID"
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        required // Required field
                    />
                    <input
                        type="text"
                        placeholder="Course Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required // Required field
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required // Required field
                    />
                    <select onChange={(e) => setTrainerId(e.target.value)} required>
                        <option value="">Select Trainer</option>
                        {trainers.map((trainer) => (
                            <option key={trainer._id} value={trainer._id}>
                                {trainer.name} {/* Display trainer names */}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <input
                        type="date"
                        placeholder="Start Date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required // Required field
                    />
                    <input
                        type="time"
                        placeholder="Start Time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required // Required field
                    />
                    <input
                        type="date"
                        placeholder="End Date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required // Required field
                    />
                    <input
                        type="time"
                        className='endtime'
                        placeholder="End Time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required // Required field
                    />
                </div>
            </div>
            <label>Select Employees</label>
            <div className="employee-checkboxes">
                {employees.map((employee) => (
                    <div className="custom-checkbox" key={employee._id}>
                        <input
                            type="checkbox"
                            id={employee._id}
                            value={employee._id}
                            checked={selectedEmployees.includes(employee._id)} // Check if employee is selected
                            onChange={() => handleEmployeeChange(employee._id)} // Handle selection change
                        />
                        <label htmlFor={employee._id}>{employee.name}</label>
                    </div>
                ))}
            </div>
            <button type="submit">Add Course</button> {/* Submit button */}
        </form>
    );
};

export default CourseForm; // Export the CourseForm component
