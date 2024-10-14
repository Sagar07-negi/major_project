import React, { useEffect, useState } from "react"; 
import axios from "axios"; 
import EmployeeForm from "./Employeeform"; 
import { AiOutlineClose } from "react-icons/ai";

// EmployeeTable component for displaying a list of employees
const EmployeeTable = () => {
    // State variables
    const [employeeCount, setEmployeeCount] = useState(0); // Total number of employees
    const [error, setError] = useState(null); // Error state for fetching data
    const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false); // Toggle for showing the form
    const [currentEmployeePage, setCurrentEmployeePage] = useState(1); // Current page for pagination
    const [employees, setEmployees] = useState([]); // Array of employee objects
    const [selectedEmployee, setSelectedEmployee] = useState(null); // Currently selected employee for details
    const rowsPerPage = 5; // Number of rows to display per page

    // Function to add a new employee to the list
    const handleAddEmployee = (newEmployee) => {
        setEmployees((prev) => [...prev, newEmployee]); // Add new employee to the state
        setShowAddEmployeeForm(false); // Close the form after adding
    };

    // Calculate total pages for pagination
    const totalEmployeePages = Math.ceil(employees.length / rowsPerPage);

    // Function to handle pagination
    const handleEmployeePageChange = (direction) => {
        if (direction === "next" && currentEmployeePage < totalEmployeePages) {
            setCurrentEmployeePage((prev) => prev + 1); // Go to next page
        } else if (direction === "prev" && currentEmployeePage > 1) {
            setCurrentEmployeePage((prev) => prev - 1); // Go to previous page
        }
    };

    // Fetch employee data and count from the API
    const fetchData = async () => {
        try {
            const [
                employeesResponse,
                employeeCountResponse,
            ] = await Promise.all([
                axios.get("http://localhost:5000/admin/employees"),
                axios.get("http://localhost:5000/admin/employees-count"),
            ]);
            setEmployees(employeesResponse.data); // Set employees state
            setEmployeeCount(employeeCountResponse.data.count); // Set employee count
        } catch (error) {
            console.error("Error fetching data:", error); // Log error
            setError("Error fetching data."); // Set error message
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data on component mount
    }, []);

    // Function to view details of a selected employee
    const handleViewEmployee = async (employee) => {
        try {
            // Fetch courses associated with the selected employee
            const response = await axios.get(`http://localhost:5000/admin/employees/${employee._id}/courses`);
            const employeeDetails = { ...employee, courses: response.data.courses || [] }; // Add courses to employee details
            setSelectedEmployee(employeeDetails); // Set selected employee state
        } catch (error) {
            console.error("Error fetching employee details:", error); // Log error
            setError("Failed to load employee details."); // Set error message
        }
    };

    // Close the detail view for the selected employee
    const closeDetailView = () => {
        setSelectedEmployee(null); // Reset selected employee state
    };

    // Paginate employees for display
    const paginatedEmployees = employees.slice(
        (currentEmployeePage - 1) * rowsPerPage,
        currentEmployeePage * rowsPerPage
    );

    return (
        <div className="emptable">
            <p className="course-title">Employees</p>
            <button
                className="sendbtn"
                onClick={() => setShowAddEmployeeForm(!showAddEmployeeForm)} // Toggle form visibility
            >
                Add Employee
            </button>
            {showAddEmployeeForm && (
                <div className="form-container">
                    <EmployeeForm
                        onAdd={handleAddEmployee} // Callback to handle new employee
                        onClose={() => setShowAddEmployeeForm(false)} // Close form handler
                    />
                </div>
            )}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Gender</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedEmployees.map((employee) => (
                        <tr key={employee?.employeeId}>
                            <td>{employee?.name}</td>
                            <td>{employee?.email}</td>
                            <td>{employee?.phone}</td>
                            <td>{employee?.address}</td>
                            <td>{employee?.gender}</td>
                            <td>
                                <button onClick={() => handleViewEmployee(employee)}>View Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button
                    className="paginationbtn"
                    onClick={() => handleEmployeePageChange("prev")} // Go to previous page
                    disabled={currentEmployeePage === 1} // Disable if on the first page
                >
                    Prev
                </button>
                <span>
                    {currentEmployeePage} of {totalEmployeePages} {/* Display current page and total pages */}
                </span>
                <button
                    className="paginationbtn"
                    onClick={() => handleEmployeePageChange("next")} // Go to next page
                    disabled={currentEmployeePage === totalEmployeePages} // Disable if on the last page
                >
                    Next
                </button>
            </div>

            {selectedEmployee && (
                <div className="employee-details">
                    <h2>Employee Details</h2>
                    <p><strong>Employee ID:</strong> {selectedEmployee.employeeId}</p>
                    <p><strong>Name:</strong> {selectedEmployee.name}</p>
                    <p><strong>Email:</strong> {selectedEmployee.email}</p>
                    <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
                    <p><strong>Address:</strong> {selectedEmployee.address}</p>
                    <p><strong>Designation:</strong> {selectedEmployee.designation}</p>
                    <p><strong>Gender:</strong> {selectedEmployee.gender}</p>
                    <p><strong>Date of Joining:</strong> {new Date(selectedEmployee.dateOfJoining).toLocaleDateString()}</p>
                    <h3>Enrolled Courses</h3>
                    <ul>
                        {selectedEmployee.courses.map(course => (
                            <li key={course._id}>{course.name}</li> // List enrolled courses
                        ))}
                    </ul>

                    <AiOutlineClose className="close-icon" onClick={closeDetailView} /> {/* Close icon for detail view */}
                </div>
            )}
        </div>
    );
};

export default EmployeeTable; // Export the EmployeeTable component
