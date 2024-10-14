import React from "react"; 

// Navbar component receives activeSection, setActiveSection, and handleLogout as props
const Navbar = ({ activeSection, setActiveSection, handleLogout }) => {
  return (
    <div className="navbar"> {/* Main container for the navbar */}
      <div className="logo"></div> {/* Placeholder for the logo */}
      <div className="buttons"> {/* Container for navigation buttons */}
        {/* Home button with conditional styling for active section */}
        <button
          className={`sidebarbtn ${activeSection === "home" ? "active" : ""}`} // Apply active class if current section is "home"
          onClick={() => setActiveSection("home")} // Update active section on click
        >
          Home
        </button>
        <br />
        {/* Employees button with conditional styling for active section */}
        <button
          className={`sidebarbtn ${activeSection === "employees" ? "active" : ""}`} // Apply active class if current section is "employees"
          onClick={() => setActiveSection("employees")} // Update active section on click
        >
          Employees
        </button>
        <br />
        {/* Trainers button with conditional styling for active section */}
        <button
          className={`sidebarbtn ${activeSection === "trainers" ? "active" : ""}`} // Apply active class if current section is "trainers"
          onClick={() => setActiveSection("trainers")} // Update active section on click
        >
          Trainers
        </button>
        <br />
        {/* Courses button with conditional styling for active section */}
        <button
          className={`sidebarbtn ${activeSection === "courses" ? "active" : ""}`} // Apply active class if current section is "courses"
          onClick={() => setActiveSection("courses")} // Update active section on click
        >
          Courses
        </button>
      </div>
      {/* Logout button */}
      <button onClick={handleLogout} className="logoutbtn">
        Logout
      </button>
    </div>
  );
};

export default Navbar; // Export the Navbar component
