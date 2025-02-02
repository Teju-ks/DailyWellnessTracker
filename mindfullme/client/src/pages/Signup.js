import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Signup() {
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // State to hold error messages
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate();

  // Function to validate password
  const validatePassword = (password) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Check for at least one special character
    return hasLetter && hasNumber && hasSpecialChar;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate password before making the API call
    if (!validatePassword(password)) {
      setError('Password must contain letters, numbers, and special characters.');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true); // Set loading state to true

    try {
      const response = await axios.post('http://localhost:5000/signup', { name, email, password });
      console.log(response.data);

      // On successful signup, redirect to login page
      setError(''); // Clear any previous error messages
      navigate('/login');
    } catch (error) {
      console.error('There was an error signing up!', error);

      // Check if the error response data is an object
      if (error.response && typeof error.response.data === 'object') {
        setError('An unexpected error occurred. Please try again.'); // Set a generic error message
      } else if (error.response && typeof error.response.data === 'string') {
        setError(error.response.data); // Set error message from server response
      } else {
        setError('An unexpected error occurred. Please try again.'); // Set a generic error message
      }
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="col-12 col-md-6 col-lg-4">
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group mb-3">
            <label>name</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={name}
              onChange={(e) => setname(e.target.value)}
              required
            />
          </div>
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
            <small className="form-text text-muted">Password must contain letters, numbers, and special characters.</small>
          </div>
          <div className="form-group mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control form-control-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}
          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}