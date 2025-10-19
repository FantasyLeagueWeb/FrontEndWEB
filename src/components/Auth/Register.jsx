import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaUser, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useToast } from '../Shared/Toast';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('participant');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const { success, error } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!firstName.trim()) {
      error('Validation Error', 'First Name is required.');
      return;
    }
    if (!lastName.trim()) {
      error('Validation Error', 'Last Name is required.');
      return;
    }
    if (!phone.trim()) {
      error('Validation Error', 'Phone Number is required.');
      return;
    }
    if (!username.trim()) {
      error('Validation Error', 'Email is required.');
      return;
    }
    if (!password.trim()) {
      error('Validation Error', 'Password is required.');
      return;
    }
    
    // Phone number pattern validation (only digits, 10-15 digits)
    const phonePattern = /^[0-9]{10,15}$/;
    if (!phonePattern.test(phone.replace(/\D/g, ''))) {
      error('Validation Error', 'Please enter a valid phone number (10-15 digits only).');
      return;
    }
    
    // Email pattern validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(username)) {
      error('Validation Error', 'Please enter a valid email address.');
      return;
    }
    
    // Password minimum length
    if (password.length < 6) {
      error('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }
    
    try {
      await register(firstName, lastName, phone, username, password, role);
      success('Registration Successful!', 'Your account has been created successfully. Please login to continue.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.log('Registration error:', err);
      console.log('Error response:', err.response);
      console.log('Error data:', err.response?.data);
      
      // Extract error message from different possible locations
      let errorMessage = '';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data) {
        errorMessage = typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      console.log('Extracted error message:', errorMessage);
      
      // Clean up long error messages and extract key information
      const cleanErrorMessage = errorMessage.toLowerCase();
      
      // Check for database constraint violations (Entity Framework errors)
      if (cleanErrorMessage.includes('violation of unique key constraint') || 
          cleanErrorMessage.includes('cannot insert duplicate key') ||
          cleanErrorMessage.includes('duplicate key value') ||
          cleanErrorMessage.includes('uq__users__') ||
          cleanErrorMessage.includes('unique constraint')) {
        error('Email Already Exists', 'This email address is already registered. Please use a different email or try logging in.');
      }
      // Check for email/username already exists error (multiple patterns)
      else if (cleanErrorMessage.includes('username') && 
          (cleanErrorMessage.includes('exist') || 
           cleanErrorMessage.includes('already') ||
           cleanErrorMessage.includes('duplicate') ||
           cleanErrorMessage.includes('taken'))) {
        error('Email Already Exists', 'This email address is already registered. Please use a different email or try logging in.');
      } else if (cleanErrorMessage.includes('email') && 
                 (cleanErrorMessage.includes('exist') || 
                  cleanErrorMessage.includes('already') ||
                  cleanErrorMessage.includes('duplicate') ||
                  cleanErrorMessage.includes('taken'))) {
        error('Email Already Exists', 'This email address is already registered. Please use a different email or try logging in.');
      } else if (err.response?.status === 400) {
        // Handle 400 status code specifically for duplicate email
        error('Email Already Exists', 'This email address is already registered. Please use a different email or try logging in.');
      } else if (err.response?.status === 500) {
        // Check if it's a database constraint error in 500 response
        if (cleanErrorMessage.includes('violation') || 
            cleanErrorMessage.includes('duplicate') ||
            cleanErrorMessage.includes('unique constraint')) {
          error('Email Already Exists', 'This email address is already registered. Please use a different email or try logging in.');
        } else {
          error('Server Error', 'There was a server error. Please try again later.');
        }
      } else {
        // For other errors, show a clean message instead of the long error
        const shortMessage = errorMessage.length > 100 ? 
          errorMessage.substring(0, 100) + '...' : 
          errorMessage;
        error('Registration Failed', shortMessage || 'Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 flex items-center justify-center">
          <FaUserPlus className="mr-2" /> Register
        </h2>
        <div className="space-y-4">
         
           <div className="flex items-center border border-gray-300 rounded-lg p-3">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full focus:outline-none"
              required
            />
          </div>
           <div className="flex items-center border border-gray-300 rounded-lg p-3">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full focus:outline-none"
              required
            />
          </div>
           <div className="flex items-center border border-gray-300 rounded-lg p-3">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="tel"
              placeholder="Phone Number (10-15 digits)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full focus:outline-none"
              required
            />
          </div>
           <div className="flex items-center border border-gray-300 rounded-lg p-3">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="email"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full focus:outline-none"
              required
            />
          </div>
         
          <div className="flex items-center border border-gray-300 rounded-lg p-3">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full focus:outline-none"
              required
            />
          </div>
          {/* <div>
            <label className="block text-gray-700 font-medium mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="participant">Participant</option>
              <option value="admin">Admin</option>
            </select>
          </div> */}
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center transform hover:scale-105"
          >
            <FaUserPlus className="mr-2" /> Register
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;