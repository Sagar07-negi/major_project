import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseForm from "./Courseform";
import { AiOutlineClose } from "react-icons/ai";

const CourseTable = () => {
    // State variables for managing courses, employees, form visibility, and pagination
    const [showAddCourseForm, setShowAddCourseForm] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [employees, setEmployees] = useState({});
    const [courseCount, setCourseCount] = useState(0);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const coursesPerPage = 6; // Number of courses per page

    // Function to fetch all courses and employees data
    const fetchData = async () => {
        try {
            const [
                coursesResponse,
                employeesResponse
            ] = await Promise.all([
                axios.get("http://localhost:5000/admin/courses"), // Fetch all courses
                axios.get("http://localhost:5000/admin/employees"), // Fetch employees
            ]);

            setCourses(coursesResponse.data);
            setCourseCount(coursesResponse.data.length); // Set course count based on the total number of courses

            const employeeMapping = {};
            employeesResponse.data.forEach(employee => {
                employeeMapping[employee._id] = employee.name;
            });
            setEmployees(employeeMapping);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Error fetching data.");
        }
    };

    // Use effect to fetch data when the component mounts
    useEffect(() => {
        fetchData();
    }, []);

    // Handle adding a new course
    const handleAddCourse = (newCourse) => {
        setCourses((prev) => [...prev, newCourse]);
        setCourseCount((prev) => prev + 1);
        setShowAddCourseForm(false);
    };

    // Handle viewing course details
    const handleViewCourse = (course) => {
        setSelectedCourse(course);
    };

    // Handle pagination change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Calculate the courses to display for the current page
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

    const totalPages = Math.ceil(courseCount / coursesPerPage);

    return (
        <div className="coursediv">
            <p className="course-title">Courses</p>

            {showAddCourseForm && (
                <div className="form-container">
                    <CourseForm
                        onAdd={handleAddCourse}
                        onClose={() => setShowAddCourseForm(false)}
                    />
                </div>
            )}

            <div className="course-cards">
                {Array.isArray(currentCourses) && currentCourses.length > 0 ? (
                    currentCourses.map((course) => (
                        <div className="course-card" key={course?.courseId}>
                            <p><strong>Name:</strong> {course?.name}</p>
                            <p><strong>Description:</strong> {course?.description}</p>
                            <p>
                                <strong>Start Date:</strong>{" "}
                                {new Date(course?.startDate).toLocaleDateString()} at{" "}
                                {new Date(course?.startDate).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                            <p>
                                <strong>End Date:</strong>{" "}
                                {new Date(course?.endDate).toLocaleDateString()} at{" "}
                                {new Date(course?.endDate).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                            <button onClick={() => handleViewCourse(course)}>View Course</button>
                        </div>
                    ))
                ) : (
                    <p>No courses available.</p>
                )}
            </div>

            <div className="pagination">
                <button
                 className="paginationbtn"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </button>

                <span>Page {currentPage} of {totalPages}</span>

                <button
                                 className="paginationbtn"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>

            <button
                className="sendbtn"
                onClick={() => setShowAddCourseForm(!showAddCourseForm)}
            >
                Add Course
            </button>

            {selectedCourse && (
                <div className="course-details">
                    <h3>Course Details</h3>
                    <p><strong>Name:</strong> {selectedCourse.name}</p>
                    <p><strong>Course ID:</strong> {selectedCourse.courseId}</p>
                    <p><strong>Description:</strong> {selectedCourse.description}</p>
                    <p>
                        <strong>Start Date:</strong>{" "}
                        {new Date(selectedCourse.startDate).toLocaleDateString()} at{" "}
                        {new Date(selectedCourse.startDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                    <p>
                        <strong>End Date:</strong>{" "}
                        {new Date(selectedCourse.endDate).toLocaleDateString()} at{" "}
                        {new Date(selectedCourse.endDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                    <p><strong>Trainer:</strong> {selectedCourse.trainer?.name}</p>
                    <p>
                        <strong>Employees:</strong>{" "}
                        {selectedCourse.employees.map(empId => employees[empId] || empId).join(", ")}
                    </p>
                    <AiOutlineClose className="close-icon" onClick={() => setSelectedCourse(null)} />
                </div>
            )}
        </div>
    );
};

export default CourseTable;
