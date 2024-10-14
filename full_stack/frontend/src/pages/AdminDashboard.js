import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseTable from "../components/CourseTable";
import TrainerTable from "../components/TrainerTable";
import EmployeeTable from "../components/EmployeeTable";
import Home from "./Home";
import Navbar from "../components/Navbar"; 

const AdminDashboard = () => {
  // State variables to manage the active section and counts
  const [activeSection, setActiveSection] = useState("home");
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalTrainers, setTotalTrainers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalEnrolledEmployees, setTotalEnrolledEmployees] = useState(0);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    navigate("/login"); // Redirect to login page
  };

  // Function to fetch total counts of employees, trainers, and courses
  const fetchCounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/total-counts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Update state with fetched counts
      setTotalEmployees(data.totalEmployees);
      setTotalTrainers(data.totalTrainers);
      setTotalCourses(data.totalCourses);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch counts"); // Set error state if fetching fails
    }
  };

  // Function to fetch courses and calculate total enrolled employees
  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data); // Update state with fetched courses
      calculateTotalEnrolledEmployees(data); // Calculate total enrolled employees
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to fetch courses"); // Set error state if fetching fails
    }
  };

  // Function to calculate total number of enrolled employees in courses
  const calculateTotalEnrolledEmployees = (courses) => {
    let totalCount = 0;
    // Loop through each course and count enrolled employees
    courses.forEach(course => {
        totalCount += course.employees.length; // Count each employee in the course
    });
    console.log(`Total Enrolled Employees Count: ${totalCount}`); // Log the total count
    setTotalEnrolledEmployees(totalCount); // Set the total employee count
  };

  // Fetch counts and courses on component mount
  useEffect(() => {
    fetchCounts();
    fetchCourses();
  }, []);

  return (
    <div className="admin-container">
      <Navbar
        activeSection={activeSection} // Pass the active section to Navbar
        setActiveSection={setActiveSection} // Function to change active section
        handleLogout={handleLogout} // Pass logout function to Navbar
      />
      <div className="right-side">
        {error && <div className="error-message">{error}</div>} {/* Display error message if exists */}
       
        {activeSection === "home" && <Home />} {/* Render Home component */}
        {activeSection === "employees" && <EmployeeTable />} {/* Render EmployeeTable */}
        {activeSection === "trainers" && <TrainerTable />} {/* Render TrainerTable */}
        {activeSection === "courses" && <CourseTable />} {/* Render CourseTable */}
      </div>
    </div>
  );
};

// Wrap AdminDashboard with authentication check
export default AdminDashboard;
