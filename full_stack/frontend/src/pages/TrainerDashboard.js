import React, { useEffect, useState } from 'react'; 
import { Link, useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios'; 
import user from "../assets/user.png"; 

const TrainerDashboard = () => {
    const { trainerId } = useParams(); // Extract trainerId from URL parameters
    const [trainer, setTrainer] = useState(null); // State to hold trainer details
    const [courses, setCourses] = useState([]); // State to hold the list of courses
    const [loading, setLoading] = useState(true); // Loading state to manage loading indicator
    const [error, setError] = useState(null); // State to handle errors

    const navigate = useNavigate(); // Use navigate for routing

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from local storage
        navigate('/login'); // Redirect to login page
    };

    // Effect to fetch trainer details and courses
    useEffect(() => {
        const fetchTrainer = async () => {
            try {
                // Fetch trainer details and courses from the API
                const response = await axios.get(`http://localhost:5000/trainer/${trainerId}`);
                setTrainer(response.data.trainer); // Set trainer details
                setCourses(response.data.courses); // Set courses associated with the trainer
            } catch (err) {
                setError('Could not fetch trainer details.'); // Handle any fetch errors
            } finally {
                setLoading(false); // Set loading to false after fetch attempt
            }
        };

        fetchTrainer(); // Call the fetch function
    }, [trainerId]); // Dependency array includes trainerId to refetch if it changes

    // Render loading state if data is still being fetched
    if (loading) return <div className="loading">Loading...</div>;
    // Render error state if there was an error fetching data
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="trainer-dashboard"> {/* Main wrapper for the dashboard */}
            <div className="sidebar"> {/* Sidebar for trainer details */}
                {trainer && ( // Conditionally render trainer details if available
                    <div className="trainer-detail">
                        <div className="icon">
                            <img src={user} alt="Trainer Profile" /> {/* Display trainer profile picture */}
                        </div>
                        <p><strong>Name:</strong> {trainer.name}</p> {/* Trainer's name */}
                        <p><strong>Email:</strong> {trainer.email}</p> {/* Trainer's email */}
                        <p><strong>Phone:</strong> {trainer.phone}</p> {/* Trainer's phone */}
                        <p><strong>Expertise:</strong> {trainer.expertise}</p> {/* Trainer's expertise */}
                        <button onClick={handleLogout}>Logout</button> {/* Logout button */}
                    </div>
                )}
            </div>

            <div className="main-content"> {/* Main content area for courses */}
                <h1>Trainer Dashboard</h1> {/* Dashboard title */}
                <h2>My Courses</h2> {/* Section title for courses */}
                <div className="course-container"> {/* Container for course cards */}
                    {courses.length === 0 ? ( // Conditional rendering if no courses available
                        <p>No courses available for this trainer.</p> // Message if no courses
                    ) : (
                        courses.map(course => ( // Map through the courses to display each one
                            <div key={course._id} className="course-card"> {/* Unique key for each course card */}
                                <p><strong>Name:</strong> {course.name}</p> {/* Course name */}
                                <p><strong>Description:</strong> {course.description}</p> {/* Course description */}
                                <p><strong>Start Date:</strong> {new Date(course.startDate).toLocaleDateString()}</p> {/* Formatted start date */}
                                <p><strong>End Date:</strong> {new Date(course.endDate).toLocaleDateString()}</p> {/* Formatted end date */}
                                <p><strong>Employees:</strong> {course.employees.length > 0 ? course.employees.map(emp => emp.name).join(', ') : 'No employees enrolled.'}</p> {/* List of enrolled employees */}
                                <Link to={`/trainer/courses/${course._id}`} style={{ textDecoration: 'none', color: 'black' }}> {/* Link to course details */}
                                    <button className='viewbtn'>View Course Details</button> {/* Button to view course details */}
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainerDashboard; // Protect the Trainer Dashboard with authentication
