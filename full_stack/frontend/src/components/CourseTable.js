import React, { useEffect, useState } from "react"; 
import axios from "axios"; 
import CourseForm from "./Courseform"; 
import { AiOutlineClose } from "react-icons/ai"; 

// Main component for displaying the course table
const CourseTable = () => {
    // State variables for managing courses, employees, and form visibility
    const [showAddCourseForm, setShowAddCourseForm] = useState(false); // Control visibility of the course form
    const [selectedCourse, setSelectedCourse] = useState(null); // Track selected course for viewing details
    const [courses, setCourses] = useState([]); // Store list of courses
    const [employees, setEmployees] = useState({}); // Store mapping of employee IDs to names
    const [courseCount, setCourseCount] = useState(0); // Track the number of courses
    const [error, setError] = useState(null); // Store error messages

    // Function to fetch courses, course count, and employees data
    const fetchData = async () => {
        try {
            const [
                coursesResponse,
                courseCountResponse,
                employeesResponse
            ] = await Promise.all([
                axios.get("http://localhost:5000/admin/courses"), // Fetch courses
                axios.get("http://localhost:5000/admin/courses-count"), // Fetch course count
                axios.get("http://localhost:5000/admin/employees"), // Fetch employees
            ]);

            setCourses(coursesResponse.data); // Update state with fetched courses
            setCourseCount(courseCountResponse.data.count); // Update course count
            
            // Create a mapping of employee IDs to names for easy access
            const employeeMapping = {};
            employeesResponse.data.forEach(employee => {
                employeeMapping[employee._id] = employee.name; // Map employee ID to name
            });
            setEmployees(employeeMapping); // Set employee mapping in state
        } catch (error) {
            console.error("Error fetching data:", error); // Log error to console
            setError("Error fetching data."); // Update error state
        }
    };

    // Use effect to fetch data on component mount
    useEffect(() => {
        fetchData(); // Fetch data when the component mounts
    }, []);

    // Function to handle adding a new course
    const handleAddCourse = (newCourse) => {
        setCourses((prev) => [...prev, newCourse]); // Add new course to the list
        setCourseCount((prev) => prev + 1); // Increment course count
        setShowAddCourseForm(false); // Hide the course form
    };

    // Function to set the selected course for viewing details
    const handleViewCourse = (course) => {
        setSelectedCourse(course); // Set selected course
    };

    return (
        <div className="coursediv">
            <p className="course-title">Courses</p> {/* Title for the course list */}
            {showAddCourseForm && (
                <div className="form-container"> {/* Container for the course form */}
                    <CourseForm
                        onAdd={handleAddCourse} // Callback for adding a course
                        onClose={() => setShowAddCourseForm(false)} // Callback for closing the form
                    />
                </div>
            )}
            <div className="course-cards">
                {Array.isArray(courses) && courses.length > 0 ? (
                    // Render course cards if courses exist
                    courses.map((course) => (
                        <div className="course-card" key={course?.courseId}> {/* Course card */}
                            <p>
                                <strong>Name:</strong> {course?.name} {/* Course name */}
                            </p>
                            <p>
                                <strong>Description:</strong> {course?.description} {/* Course description */}
                            </p>
                            <p>
                                <strong>Start Date:</strong>{" "}
                                {new Date(course?.startDate).toLocaleDateString()} at{" "}
                                {new Date(course?.startDate).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })} {/* Course start date and time */}
                            </p>
                            <p>
                                <strong>End Date:</strong>{" "}
                                {new Date(course?.endDate).toLocaleDateString()} at{" "}
                                {new Date(course?.endDate).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })} {/* Course end date and time */}
                            </p>
                            <button onClick={() => handleViewCourse(course)}> {/* Button to view course details */}
                                View Course
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No courses available.</p> // Message if no courses exist
                )}
            </div>
            <button
                className="sendbtn"
                onClick={() => setShowAddCourseForm(!showAddCourseForm)} // Toggle form visibility
            >
                Add Course
            </button>
            {selectedCourse && (
                <div className="course-details"> {/* Container for selected course details */}
                    <h3>Course Details</h3>
                    <p>
                        <strong>Name:</strong> {selectedCourse.name} {/* Display selected course name */}
                    </p>
                    <p>
                        <strong>Course ID:</strong> {selectedCourse.courseId} {/* Display selected course ID */}
                    </p>
                    <p>
                        <strong>Description:</strong> {selectedCourse.description} {/* Display course description */}
                    </p>
                    <p>
                        <strong>Start Date:</strong>{" "}
                        {new Date(selectedCourse.startDate).toLocaleDateString()} at{" "}
                        {new Date(selectedCourse.startDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })} {/* Display start date and time of selected course */}
                    </p>
                    <p>
                        <strong>End Date:</strong>{" "}
                        {new Date(selectedCourse.endDate).toLocaleDateString()} at{" "}
                        {new Date(selectedCourse.endDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })} {/* Display end date and time of selected course */}
                    </p>
                    <p>
                        <strong>Trainer:</strong> {selectedCourse.trainer?.name} {/* Display trainer's name */}
                    </p>
                    <p>
                        <strong>Employees:</strong> {selectedCourse.employees.map(empId => employees[empId] || empId).join(", ")} {/* Display names of selected employees */}
                    </p>
                    <AiOutlineClose className="close-icon" onClick={() => setSelectedCourse(null)} /> {/* Close icon to clear selected course */}
                </div>
            )}
        </div>
    );
};

export default CourseTable; // Export the CourseTable component
