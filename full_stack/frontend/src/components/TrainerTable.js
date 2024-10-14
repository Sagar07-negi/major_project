import React, { useEffect, useState } from "react"; 
import TrainerForm from "../components/Trainerform"; 
import axios from "axios"; 
import { AiOutlineClose } from "react-icons/ai"; 

const TrainerTable = () => {
    const [showAddTrainerForm, setShowAddTrainerForm] = useState(false); // State to control form visibility
    const [trainers, setTrainers] = useState([]); // State for the list of trainers
    const [currentTrainerPage, setCurrentTrainerPage] = useState(1); // State for pagination
    const [trainerCount, setTrainerCount] = useState(0); // State for total trainer count
    const [selectedTrainer, setSelectedTrainer] = useState(null); // State for selected trainer details
    const [error, setError] = useState(null); // State for error handling

    const rowsPerPage = 5; // Define number of rows per page

    // Fetch trainer data from the API
    const fetchData = async () => {
        try {
            const [
                trainersResponse,
                trainerCountResponse
            ] = await Promise.all([
                axios.get("http://localhost:5000/admin/trainers"),
                axios.get("http://localhost:5000/admin/trainers-count"),
            ]);
            setTrainers(trainersResponse.data); // Set trainers data
            setTrainerCount(trainerCountResponse.data.count); // Set trainer count
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Error fetching data."); // Handle error
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data on component mount
    }, []);

    const totalTrainerPages = Math.ceil(trainers.length / rowsPerPage); // Calculate total pages

    const handleViewTrainer = (trainer) => {
        setSelectedTrainer(trainer); // Set selected trainer for details view
    };

    const handleTrainerPageChange = (direction) => {
        // Change page based on direction
        if (direction === "next" && currentTrainerPage < totalTrainerPages) {
            setCurrentTrainerPage((prev) => prev + 1);
        } else if (direction === "prev" && currentTrainerPage > 1) {
            setCurrentTrainerPage((prev) => prev - 1);
        }
    };

    const handleAddTrainer = (newTrainer) => {
        setTrainers((prev) => [...prev, newTrainer]); // Add new trainer to the list
        setShowAddTrainerForm(false); // Close the form
    };

    // Get paginated trainers for the current page
    const paginatedTrainers = trainers.slice(
        (currentTrainerPage - 1) * rowsPerPage,
        currentTrainerPage * rowsPerPage
    );

    return (
        <div className="emptable">
            <p className="course-title">Trainers</p>
            <button
                className="sendbtn"
                onClick={() => setShowAddTrainerForm(!showAddTrainerForm)} // Toggle form visibility
            >
                Add Trainer
            </button>
            {showAddTrainerForm && (
                <div className="form-container">
                    <TrainerForm
                        onAdd={handleAddTrainer} // Pass handler to form
                        onClose={() => setShowAddTrainerForm(false)} // Close form handler
                    />
                </div>
            )}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Expertise</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedTrainers.map((trainer) => (
                        <tr key={trainer?.trainerId}>
                            <td>{trainer?.name}</td>
                            <td>{trainer?.email}</td>
                            <td>{trainer?.phone}</td>
                            <td>{trainer?.expertise}</td>
                            <td>
                                <button onClick={() => handleViewTrainer(trainer)}>View Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button
                    className="paginationbtn"
                    onClick={() => handleTrainerPageChange("prev")}
                    disabled={currentTrainerPage === 1} // Disable button on first page
                >
                    Prev
                </button>
                <span>
                    {currentTrainerPage} of {totalTrainerPages} {/* Show current page info */}
                </span>
                <button
                    className="paginationbtn"
                    onClick={() => handleTrainerPageChange("next")}
                    disabled={currentTrainerPage === totalTrainerPages} // Disable button on last page
                >
                    Next
                </button>
            </div>

            {/* Trainer Details Section */}
            {selectedTrainer && (
                <div className="trainer-details">
                    <h3>Trainer Details</h3>
                    <p>
                        <strong>Trainer ID:</strong> {selectedTrainer.trainerId}
                    </p>
                    <p>
                        <strong>Name:</strong> {selectedTrainer.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {selectedTrainer.email}
                    </p>
                    <p>
                        <strong>Phone:</strong> {selectedTrainer.phone}
                    </p>
                    <p>
                        <strong>Expertise:</strong> {selectedTrainer.expertise}
                    </p>

                    {/* Displaying Courses */}
                    <h4>Courses</h4>
                    {selectedTrainer.courses.length > 0 ? (
                        <ul>
                            {selectedTrainer.courses.map((course) => (
                                <li key={course._id}>
                                    <strong>Name:</strong> {course.name} <br />
                                    <strong>Description:</strong> {course.description}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No courses assigned.</p> // Message when no courses
                    )}
                    <AiOutlineClose className="close-icon" onClick={() => setSelectedTrainer(null)} /> {/* Close details */}
                </div>
            )}
        </div>
    );
};

export default TrainerTable; // Export the TrainerTable component
