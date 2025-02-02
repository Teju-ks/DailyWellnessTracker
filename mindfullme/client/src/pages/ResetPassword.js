import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ResetPassword() {
    const { token } = useParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the email associated with the reset token
        axios.get(`http://localhost:5000/reset-password/${token}`)
            .then(response => {
                setEmail(response.data.email);
            })
            .catch(error => {
                console.error('There was an error!', error);
                setError('Invalid or expired token.');
            });
    }, [token]);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/reset-password/${token}`, { email, password });
            setMessage(response.data.message);
            setError('');
            navigate('/login');
        } catch (error) {
            console.error('There was an error!', error);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="col-12 col-md-6 col-lg-4">
                <h2 className="text-center mb-4">Reset Password</h2>
                {email && <p>Reset password for: <strong>{email}</strong></p>}
                <form onSubmit={handleResetPassword} className="reset-password-form">
                    <div className="form-group mb-3">
                        <label>New Password</label>
                        <input
                            type="password"
                            className="form-control form-control-sm"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            className="form-control form-control-sm"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Reset Password</button>
                </form>
                {message && <div className="alert alert-success mt-3">{message}</div>}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
        </div>
    );
}