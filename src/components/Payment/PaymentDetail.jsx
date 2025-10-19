// Frontend: Updated PaymentDetail.js (user side, enhanced with modal for image view)

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import paymentService from '../../services/paymentService';
import { FaMoneyBill, FaImage } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useToast } from '../Shared/Toast';

const PaymentDetail = () => {
  const { id } = useParams();
  const { success, error } = useToast();
  const [payment, setPayment] = useState(null);
  const [base64, setBase64] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const data = await paymentService.getPaymentById(id);
        setPayment(data);
      } catch (error) {
        console.error('Failed to fetch payment', error);
      }
    };
    fetchPayment();
  }, [id]);

  const handleViewImage = async () => {
    try {
      const base64Data = await paymentService.getImageBase64(id);
      setBase64(base64Data);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch image', error);
    }
  };

  if (!payment) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Loading recharge details...</p>
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
          <FaMoneyBill className="w-12 h-12 text-indigo-600 mr-4" />
          <h2 className="text-3xl font-bold text-gray-900">Recharge Request #{payment.userAmountRecahargeId}</h2>
        </div>
        <p className="text-gray-700 text-lg mb-2"><strong>User Entered Amount:</strong> Rs {payment.userEnteredAmount}</p>
        {payment.adminApprovedAmount && <p className="text-gray-700 text-lg mb-2"><strong>Approved Amount:</strong> Rs {payment.adminApprovedAmount}</p>}
        <p className="text-gray-700 text-lg mb-2"><strong>Status:</strong> {payment.status}</p>
        <p className="text-gray-700 text-lg mb-2"><strong>Created At:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
        {payment.urlProof && (
          <button
            onClick={handleViewImage}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transform hover:scale-105 transition-transform duration-200"
          >
            <FaImage className="mr-2" /> View Proof Image
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-3xl overflow-auto">
            <img src={`data:image/jpeg;base64,${base64}`} alt="Proof" className="max-w-full max-h-96" />
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentDetail;