import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignInAlt, FaUser, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useToast } from '../Shared/Toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { success, error } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      success('Login Successful!', 'Welcome back!');
      navigate('/');
    } catch (err) {
      error('Login Failed', err.message || 'Invalid credentials. Please try again.');
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
          <FaSignInAlt className="mr-2" /> Login
        </h2>
        <div className="space-y-4">
          <div className="flex items-center border border-gray-300 rounded-lg p-3">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Username"
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
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center transform hover:scale-105"
          >
            <FaSignInAlt className="mr-2" /> Login
          </button>
          
          <div className="mt-4 text-center">
            <Link 
              to="/forgot-password" 
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;