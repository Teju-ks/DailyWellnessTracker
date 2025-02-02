import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import MoodTracker from './pages/MoodTracker';
import MorningRoutine from './pages/MorningRoutine';
import FoodJournal from './pages/FoodJournal'; 
import Study from './pages/Study'; 
import SelfCare from './pages/SelfCare'; 
import SocialMediaDetox from './pages/SocialMediaDetox';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DashboardF from './pages/DashboardF';
import './App.css';
import Dashboard from './pages/Dashboard';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => {
        console.log('Logging in...');
        setIsAuthenticated(true);
    };

    return (
        <div className="App">
            <Navbar />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/login" element={<Login onLogin={login} />} />
                <Route path="/profile" element={<Profile />} />                
                <Route path="/signup" element={<Signup />} />
                <Route path="/mood-tracker" element={<MoodTracker />} />
                <Route path="/food-journal" element={<FoodJournal />} /> 
                <Route path="/study" element={<Study />} /> 
                <Route path="/self-care" element={<SelfCare />} /> 
                <Route path="/morning-routine" element={<MorningRoutine />} /> 
                <Route path="/social-media-detox" element={<SocialMediaDetox />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />  
                <Route path="/dashboard" element={<Dashboard/>}/>   
                <Route path="/dashboardF" element={<DashboardF />} />
         
                </Routes>
        </div>
    );
}

export default App;