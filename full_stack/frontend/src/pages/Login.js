import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import axios from 'axios'; 

const Login = () => {
    // State variables to manage form input and UI state
    const [email, setEmail] = useState(''); // Email state
    const [password, setPassword] = useState(''); // Password state
    const [isAdmin, setIsAdmin] = useState(true); // Toggle for admin or trainer login
    const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility

    const navigate = useNavigate(); // Use navigate for redirecting



    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Admin login logic
        if (isAdmin) {
            try {
                const response = await axios.post('http://localhost:5000/admin/login', { email, password }); // API call for admin login
                if (response.data.success) {
                    console.log(response.data.success)
                    navigate('/admin/dashboard'); // Redirect to admin dashboard
                } else {
                    toast.error("Login failed, no token received", { position: "top-right" }); // Error toast
                }
            } catch (error) {
                console.error("Admin login error:", error.response || error); // Log error
                toast.error(error.response?.data?.message || "Invalid admin credentials", { position: "top-right" }); // Error toast
            }
        } else { // Trainer login logic
            try {
                const response = await axios.post('http://localhost:5000/trainer/check-trainer', { email }); // API call to check trainer
                const {  trainerId } = response.data; // Extract token and trainer ID
                if ( response.data.success) {
                    console.log(response.data.success)
                    console.log(trainerId);
                    
                    navigate(`/trainer/dashboard/${trainerId}`); // Redirect to trainer dashboard
                } else {
                    toast.error("Login failed, token or trainerId missing", { position: "top-right" }); // Error toast
                }
            } catch (error) {
                console.error("Trainer login error:", error.response || error); // Log error
                toast.error(error.response?.data?.message || "Trainer not found", { position: "top-right" }); // Error toast
            }
        }
    };

    return (
        <div className="login-wrapper"> {/* Main wrapper for the login form */}
            <div className="wrapper">
                <form onSubmit={handleSubmit}> {/* Form submission handler */}
                    <h1>{isAdmin ? "Admin Login" : "Trainer Login"}</h1> {/* Conditional header based on login type */}
                    <div className="input-box"> {/* Input box for email */}
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)} // Update email state
                            placeholder="Email"
                            required // Email is required
                        />
                        <FaUser className="icon" /> {/* User icon */}
                    </div>
                    {isAdmin && ( // Render password input only for admin
                        <div className="input-box">
                            <input
                                type={showPassword ? "text" : "password"} // Toggle password visibility
                                value={password}
                                onChange={e => setPassword(e.target.value)} // Update password state
                                placeholder="Password"
                                required // Password is required
                            />
                            <FaLock className="icon" /> {/* Lock icon */}
                            <span 
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                                style={{ cursor: 'pointer' }}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Eye icon for showing/hiding password */}
                            </span>
                        </div>
                    )}
                    <button type="submit" className="btn">Login</button> {/* Submit button */}
                    <p className="switch-role" onClick={() => setIsAdmin(!isAdmin)}> {/* Switch between admin and trainer login */}
                        {isAdmin ? "Switch to Trainer Login" : "Switch to Admin Login"}
                    </p>
                </form>
                <ToastContainer /> {/* Toast container for notifications */}
            </div>
        </div>
    );
};

export default Login; // Export the Login component
