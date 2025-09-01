import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import { FaUser, FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AuthContext } from '../../contexts/AuthContext';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { user: userA } = useContext(AuthContext); // Renamed to avoid conflict with state variable
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set isAdmin based on AuthContext
    setIsAdmin(userA?.role?.toLowerCase() === 'admin');

    const fetchUser = async () => {
      try {
        const data = await userService.getUserById(id);
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };
    fetchUser();
  }, [id, userA]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        navigate('/users');
      } catch (error) {
        console.error('Failed to delete user', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Loading user details...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-10 min-h-screen bg-gray-100"
    >
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <FaUser className="w-12 h-12 text-indigo-600 mr-4" />
          <h2 className="text-3xl font-bold text-gray-900">User #{user.userId}</h2>
        </div>
        <p className="text-gray-700 text-lg mb-2"><strong>Username:</strong> {user.username}</p>
        <p className="text-gray-700 text-lg mb-2"><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
        <p className="text-gray-700 text-lg mb-2"><strong>Role:</strong> {user.role}</p>
        <p className="text-gray-700 text-lg mb-2"><strong>Active:</strong> {user.active ? 'Yes' : 'No'}</p>
        <p className="text-gray-700 text-lg mb-2"><strong>Date of Birth:</strong> {user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</p>
        <p className="text-gray-700 text-lg mb-2"><strong>Phone Number:</strong> {user.phoneNumber}</p>
        {isAdmin && (
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => navigate(`/users/edit/${user.userId}`)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center transform hover:scale-105 transition-transform duration-200"
            >
              <FaEdit className="mr-2" /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center transform hover:scale-105 transition-transform duration-200"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserDetail;