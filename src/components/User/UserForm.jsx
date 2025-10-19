// Frontend: UserForm.js (adapted for users, add/edit, only accessible to admins, password field optional on edit)

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userService from '../../services/userService';
import { FaSave, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useToast } from '../Shared/Toast';

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { success, error } = useToast();
  const isEdit = !!id;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('participant');
  const [active, setActive] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
    const { user } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
   

    if (isEdit) {
      const fetchUser = async () => {
        try {
          const data = await userService.getUserById(id);
          setUsername(data.username);
          setRole(data.role);
          setActive(data.active);
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          // setDob(data.dob ? new Date(data.dob).toISOString().split('T')[0] : '');
          setPhoneNumber(data.phoneNumber || '');
        } catch (error) {
          console.error('Failed to fetch user', error);
        }
      };
      fetchUser();
    }
  }, [id, isEdit, navigate]);

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
    if (!phoneNumber.trim()) {
      error('Validation Error', 'Phone Number is required.');
      return;
    }
    if (!username.trim()) {
      error('Validation Error', 'Email is required.');
      return;
    }
    
    // Phone number pattern validation (only digits, 10-15 digits)
    const phonePattern = /^[0-9]{10,15}$/;
    if (!phonePattern.test(phoneNumber.replace(/\D/g, ''))) {
      error('Validation Error', 'Please enter a valid phone number (10-15 digits only).');
      return;
    }
    
    // Email pattern validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(username)) {
      error('Validation Error', 'Please enter a valid email address.');
      return;
    }
    
    // Password validation (required for new users, optional for edit)
    if (!isEdit && !password.trim()) {
      error('Validation Error', 'Password is required for new users.');
      return;
    }
    if (password && password.length < 6) {
      error('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }
    
    const userData = {
      userId: isEdit ? parseInt(id) : 0,
      username,
      password, // Password is optional on edit
      role,
      active,
      firstName,
      lastName,
      // dob: dob ? new Date(dob) : null,
      phoneNumber
    };
    try {
      if (isEdit) {
        await userService.updateUser(userData);
        success('User Updated!', 'User has been updated successfully.');
      } else {
        await userService.addUser(userData);
        success('User Created!', 'New user has been created successfully.');
      }
      navigate('/users');
    } catch (err) {
      console.error('Failed to save user', err);
      console.log('User save error:', err);
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
        error('Email Already Exists', 'This email address is already registered. Please use a different email.');
      }
      // Check for email/username already exists error (multiple patterns)
      else if (cleanErrorMessage.includes('username') && 
          (cleanErrorMessage.includes('exist') || 
           cleanErrorMessage.includes('already') ||
           cleanErrorMessage.includes('duplicate') ||
           cleanErrorMessage.includes('taken'))) {
        error('Email Already Exists', 'This email address is already registered. Please use a different email.');
      } else if (cleanErrorMessage.includes('email') && 
                 (cleanErrorMessage.includes('exist') || 
                  cleanErrorMessage.includes('already') ||
                  cleanErrorMessage.includes('duplicate') ||
                  cleanErrorMessage.includes('taken'))) {
        error('Email Already Exists', 'This email address is already registered. Please use a different email.');
      } else if (err.response?.status === 400) {
        // Handle 400 status code specifically for duplicate email
        error('Email Already Exists', 'This email address is already registered. Please use a different email.');
      } else if (err.response?.status === 500) {
        // Check if it's a database constraint error in 500 response
        if (cleanErrorMessage.includes('violation') || 
            cleanErrorMessage.includes('duplicate') ||
            cleanErrorMessage.includes('unique constraint')) {
          error('Email Already Exists', 'This email address is already registered. Please use a different email.');
        } else {
          error('Server Error', 'There was a server error. Please try again later.');
        }
      } else {
        // For other errors, show a clean message instead of the long error
        const shortMessage = errorMessage.length > 100 ? 
          errorMessage.substring(0, 100) + '...' : 
          errorMessage;
        error('User Save Failed', shortMessage || 'Failed to save user. Please try again.');
      }
    }
  };

  if (user?.role?.toLowerCase() !== 'admin') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-10 min-h-screen bg-gray-100"
    >
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">{isEdit ? 'Edit User' : 'Add User'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Password {isEdit ? '(Leave blank to keep current)' : ''}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required={!isEdit}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="participant">participant</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="active">Active</label>
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div> */}
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="Phone Number (10-15 digits)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center transform hover:scale-105 shadow-md"
            >
              <FaSave className="mr-2" /> Save
            </button>
            <Link
              to="/users"
              className="flex-1 bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center transform hover:scale-105 shadow-md"
            >
              <FaTimes className="mr-2" /> Cancel
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default UserForm;