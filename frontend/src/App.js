import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Page Imports
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './LoginPage';
import InfoPage from './pages/InfoPage';
import { UserProvider } from './UserContext'; // Import the provider

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    {/* 1. PUBLIC LANDING PAGE */}
                    <Route path="/" element={<LandingPage />} />
                    
                    {/* 2. AUTHENTICATION */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<LoginPage />} /> 
                    
                    {/* 3. DASHBOARDS */}
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />

                    {/* 4. DYNAMIC INFO PAGES */}
                    <Route path="/info" element={<InfoPage />} />

                    {/* Redirect any unknown routes back to home */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;