// Frontend: Updated PaymentRequestForm.js (admin side, for manual add, updated to append userId to formData for backend override)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paymentService from '../../services/paymentService';
import { FaSave, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PaymentRequestForm = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [userEnteredAmount, setUserEnteredAmount] = useState('');
  const [proof, setProof] = useState(null);

  const handleFileChange = (e) => {
    setProof(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proof) return alert('Please upload proof image.');
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('userEnteredAmount', userEnteredAmount);
    formData.append('proof', proof);
    try {
      await paymentService.addPayment(formData);
      navigate('/payment-requests');
    } catch (error) {
      console.error('Failed to save payment request', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-10 min-h-screen bg-gray-100"
    >
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Add Payment Request (Admin)</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="userId">User ID</label>
            <input
              type="number"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="userEnteredAmount">Amount</label>
            <input
              type="number"
              id="userEnteredAmount"
              value={userEnteredAmount}
              onChange={(e) => setUserEnteredAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="proof">Upload Proof Screenshot</label>
            <input
              type="file"
              id="proof"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              accept="image/*"
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
              to="/payment-requests"
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

export default PaymentRequestForm;