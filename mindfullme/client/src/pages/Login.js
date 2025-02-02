import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State to hold error messages
    const navigate = useNavigate();

    // Function to validate password
    const validatePassword = (password) => {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        return hasLetter && hasNumber;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validate password before making the API call
        if (!validatePassword(password)) {
            setError('Password must contain both letters and numbers.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            console.log(response.data);

            // Store user ID and name in local storage
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('userName', response.data.userName);

            // Log the stored values (for debugging purposes)
            console.log('Stored userId:', localStorage.getItem('userId'));
            console.log('Stored userName:', localStorage.getItem('userName'));

            setError(''); // Clear any previous error messages
            navigate('/profile'); // Redirect to the profile page upon successful login
        } catch (error) {
            console.error('There was an error logging in!', error);
            if (error.response && error.response.data) {
                setError(error.response.data); // Set error message from server response
            } else {
                setError('An unexpected error occurred. Please try again.'); // Set a generic error message
            }
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="col-12 col-md-6 col-lg-4">
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control form-control-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control form-control-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}
                    <button type="submit" className="btn btn-primary btn-block">Login</button>
                </form>
                <p className="mt-3 text-center">
                    Don’t have an account? <a href="/signup">Sign up</a>
                </p>
                <p className="mt-2 text-center">
                    <a href="/forgot-password">Forgot Password?</a>
                </p>
            </div>
        </div>
    );
}