import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css';
import { BASE_URL } from '../index';
// const BASE_URL = 'https://8000-kill3rstabs-codingasses-w0ipfvg60f1.ws-us116.gitpod.io';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Registration successful:', response.data);
      alert('Registration successful! Redirecting to login...');
      window.location.href = '/login';
    } catch (error) {
      console.log('Error during registration:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
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
          <label className="input-label" style={{ paddingRight: '35px' }}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label className="input-label" style={{ paddingRight: '5px' }}>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
