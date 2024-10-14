import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseDetail = () => {
    const { courseId } = useParams(); // Get course ID from URL parameters
    const navigate = useNavigate(); // Hook for navigation
    const [course, setCourse] = useState(null); // State to hold course details
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [scores, setScores] = useState({}); // State to hold scores for employees
    const [feedbacks, setFeedbacks] = useState({}); // State to hold feedbacks for employees
    const [submittedStatus, setSubmittedStatus] = useState({}); // Track submission status for each employee

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/trainer/courses/${courseId}`);
                console.log("Res", response.data);
                setCourse(response.data); // Save course details to state

                // Initialize states for scores, feedbacks, and submitted status
                const initialScores = {};
                const initialFeedbacks = {};
                const initialSubmittedStatus = {};

                // Loop through employees to set initial states
                response.data.employees.forEach(emp => {
                    // Set initial score if it exists
                    initialScores[emp._id] = emp.score ? emp.score.score : '';

                    // Set initial feedback or default structure if it exists
                    initialFeedbacks[emp._id] = emp.score && emp.score.feedback ? emp.score.feedback : {
                        discipline: 0,
                        punctuality: 0,
                        Leadership: 0,
                        communication: 0
                    };

                    // Mark as submitted if score exists
                    initialSubmittedStatus[emp._id] = emp.score ? true : false;
                });

                // Update state with initial values
                setScores(initialScores); 
                setFeedbacks(initialFeedbacks); 
                setSubmittedStatus(initialSubmittedStatus); 
            } catch (err) {
                console.error('Error fetching course details:', err);
                setError('Could not fetch course details.'); // Handle error
            } finally {
                setLoading(false); // Set loading to false after request
            }
        };

        fetchCourseDetails(); // Fetch course details on component mount
    }, [courseId]);

    // Function to handle score input change
    const handleScoreChange = (empId, value) => {
        if (value < 0 || value > 10 ) return; // Restrict input to 0-10 
        setScores({ ...scores, [empId]: value }); // Update scores state
    };

    // Function to handle feedback input change
    const handleFeedbackChange = (empId, field, value) => {
        if (value < 0 || value > 5) return; // Restrict feedback input to 0-5
        setFeedbacks({
            ...feedbacks,
            [empId]: { ...feedbacks[empId], [field]: value } // Update specific feedback field
        });
    };

    // Function to submit score and feedback
    const handleSubmitScore = async (empId) => {
        // Check if score is entered for the employee
        if (!scores[empId]) {
            alert('Please enter a score before submitting.'); // Alert if score is missing
            return;
        }

        const confirmSubmission = window.confirm('Are you sure you want to submit the score and feedback?');
        
        if (!confirmSubmission) return; // Confirm submission

        const scoreWithFeedback = {
            employeeId: empId,
            courseId: courseId,
            score: scores[empId],
            feedback: feedbacks[empId]
        };

        try {
            await axios.post(`http://localhost:5000/trainer/courses/${courseId}/scores`, scoreWithFeedback); // Submit data to the server
            alert(`Score and feedback for ${empId} submitted successfully!`);

            // Mark the employee as submitted
            setSubmittedStatus({
                ...submittedStatus,
                [empId]: true
            });
        } catch (err) {
            console.error('Error submitting score:', err);
            alert('Could not submit score.'); // Handle submission error
        }
    };

    // Show loading state while fetching data
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>; // Show error message if exists

    return (
        <div className="course-detail-container">
            {course ? (
                <div>
                    <h1>Course Details</h1>
                    <p><strong>Name:</strong> {course.name}</p>
                    <p><strong>Description:</strong> {course.description}</p>
                    <p><strong>Start Date:</strong> {new Date(course.startDate).toLocaleDateString()}</p>
                    <p><strong>End Date:</strong> {new Date(course.endDate).toLocaleDateString()}</p>

                    <h3>Employees</h3>
                    <ul>
                        {/* Filter employees who haven't submitted their scores and feedbacks */}
                        {course.employees.filter(emp => !submittedStatus[emp._id]).map(emp => (
                            <li key={emp._id}>
                                <p><strong>Name:</strong> {emp.name}</p>
                                <p>Evaluation Score: <br/>
                                    <input 
                                        type="number" 
                                        value={scores[emp._id] || ''} 
                                        onChange={(e) => handleScoreChange(emp._id, e.target.value)} 
                                        min="0"
                                        max="10"
                                        disabled={submittedStatus[emp._id]} // Disable input if submitted
                                    />
                                </p>
                                {/* Show feedback inputs only if score has not been submitted */}
                                {!submittedStatus[emp._id] && (
                                    <div className='feedback-section'>
                                        {['discipline', 'punctuality', 'Leadership', 'communication'].map(field => (
                                            <div className='feedbackdiv' key={field}>
                                                <label>{field.charAt(0).toUpperCase() + field.slice(1)}: </label>
                                                <br/>
                                                <input 
                                                    type="number" 
                                                    min="0" 
                                                    max="5" 
                                                    value={feedbacks[emp._id]?.[field] || ''} 
                                                    onChange={(e) => handleFeedbackChange(emp._id, field, e.target.value)} 
                                                    disabled={submittedStatus[emp._id]} // Disable input if submitted
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* Submit button for each employee */}
                                {!submittedStatus[emp._id] ? (
                                    <button onClick={() => handleSubmitScore(emp._id)} className="submit-scores-button">
                                        Submit Score and Feedback
                                    </button>
                                ) : (
                                    <p>Score and feedback submitted.</p>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Section for Submitted Scores and Feedbacks */}
                    <h3>Submitted Scores and Feedbacks</h3>
                    <ul className='submitted'>
                        {course.employees.filter(emp => submittedStatus[emp._id]).map(emp => (
                            <li key={emp._id}>
                                <p><strong>Name:</strong> {emp.name}</p>
                                <p><strong>Submitted Score:</strong> {scores[emp._id]}</p>
                                <p><strong>Discipline:</strong> {feedbacks[emp._id]?.discipline}</p>
                                <p><strong>Punctuality:</strong> {feedbacks[emp._id]?.punctuality}</p>
                                <p><strong>Leadership:</strong> {feedbacks[emp._id]?.Leadership}</p>
                                <p><strong>Communication:</strong> {feedbacks[emp._id]?.communication}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No course details available.</p>
            )}
        </div>
    );
};

export default CourseDetail;
