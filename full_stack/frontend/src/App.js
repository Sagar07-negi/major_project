import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TrainerDashboard from './pages/TrainerDashboard'; // Import TrainerDashboard
import CourseDetail from './pages/CourseDetail'; // Import CourseDetail

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/trainer/dashboard/:trainerId" element={<TrainerDashboard />} />
                <Route path="/trainer/courses/:courseId" element={<CourseDetail />} /> {/* Change component to element */}
            </Routes>
        </Router>
    );
}

export default App;












