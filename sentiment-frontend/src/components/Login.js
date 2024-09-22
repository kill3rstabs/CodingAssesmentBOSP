import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css'; // Adjust the path based on your folder structure
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { BASE_URL } from '../index';

// const BASE_URL = 'https://8000-kill3rstabs-codingasses-w0ipfvg60f1.ws-us116.gitpod.io';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const token = response.data.token;
      localStorage.setItem('authToken', token);
      alert('Login successful!');

      window.location.href = '/reviews';
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Invalid username or password');
      } else {
        alert('Login failed. Please try again.');
      }
    }
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Navigate to the registration page
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label className="input-label">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label className="input-label">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <div className="register-link">
        <p>New to our site? <button onClick={handleRegisterClick} className="register-button">Register</button></p>
      </div>
    </div>
  );
};

export default Login;
