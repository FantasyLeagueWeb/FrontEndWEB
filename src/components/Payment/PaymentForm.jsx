// Frontend: Updated PaymentForm.js (user side, add only, no edit, with payment info, file upload, enhanced UI)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paymentService from '../../services/paymentService';
import { FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PaymentForm = () => {
  const navigate = useNavigate();
  const [userEnteredAmount, setUserEnteredAmount] = useState('');
  const [proof, setProof] = useState(null);

  const handleFileChange = (e) => {
    setProof(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proof) return alert('Please upload proof image.');
    const formData = new FormData();
    formData.append('userEnteredAmount', userEnteredAmount);
    formData.append('proof', proof);
    try {
      await paymentService.addPayment(formData);
      navigate('/payments');
    } catch (error) {
      console.error('Failed to save recharge', error);
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
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Add Recharge Request</h2>
        <div className="mb-6 bg-indigo-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Payment Information</h3>
          <p>Transfer the amount to one of the following accounts and upload the screenshot:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>JazzCash: 0300-1234567</li>
            <li>EasyPaisa: 0300-7654321</li>
            <li>Bank Account: IBAN PK12ABCD0000000000000000</li>
          </ul>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="userEnteredAmount">Amount</label>
            <input
              type="number"
              id="userEnteredAmount"
              name="userEnteredAmount"
              placeholder="Enter Amount"
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
              name="proof"
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
              to="/payments"
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

export default PaymentForm;