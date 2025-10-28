// Frontend: Updated PaymentRequestDetail.js (admin side, with approve/reject form, image view modal, added User Name display)

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import paymentService from '../../services/paymentService';
import { FaMoneyBill, FaImage, FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PaymentRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [adminApprovedAmount, setAdminApprovedAmount] = useState('');
  const [base64, setBase64] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const data = await paymentService.getPaymentById(id);
        setPayment(data);
      } catch (error) {
        console.error('Failed to fetch payment request', error);
      }
    };
    fetchPayment();
  }, [id]);

  const handleViewImage = async () => {
    try {
      setImageLoading(true);
      setImageLoaded(false);
      const base64Data = await paymentService.getImageBase64(id);
      setBase64(base64Data);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch image', error);
      alert('Failed to load proof image. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!adminApprovedAmount) return alert('Enter approved amount.');
    try {
      await paymentService.approvePayment(id, parseFloat(adminApprovedAmount));
      navigate('/payment-requests');
    } catch (error) {
      console.error('Failed to approve', error);
    }
  };

  const handleReject = async () => {
    try {
      await paymentService.rejectPayment(id);
      navigate('/payment-requests');
    } catch (error) {
      console.error('Failed to reject', error);
    }
  };

  if (!payment) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Loading payment request details...</p>
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
          <h2 className="text-3xl font-bold text-gray-900">Payment Request #{payment.userAmountRechargeId}</h2>
        </div>
        <p className="text-gray-700 text-lg mb-2"><strong>User ID:</strong> {payment.userId}</p>
        <p className="text-gray-700 text-lg mb-2"><strong>User Name:</strong> {payment.userFullName}</p>
        <p className="text-gray-700 text-lg mb-2"><strong>User Entered Amount:</strong> {payment.userEnteredAmount} Rs</p>
        {payment.adminApprovedAmount && <p className="text-gray-700 text-lg mb-2"><strong>Approved Amount:</strong> {payment.adminApprovedAmount} Rs</p>}
        <p className="text-gray-700 text-lg mb-2"><strong>Status:</strong> {payment.status}</p>
        <p className="text-gray-700 text-lg mb-2"><strong>Created At:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
        {payment.urlProof && (
          <button
            onClick={handleViewImage}
            disabled={imageLoading}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transform hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {imageLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading Image...
              </>
            ) : (
              <>
                <FaImage className="mr-2" /> View Proof Image
              </>
            )}
          </button>
        )}
        {payment.status === 'Pending' && (
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-1" htmlFor="adminApprovedAmount">Approved Amount</label>
            <input
              type="number"
              id="adminApprovedAmount"
              value={adminApprovedAmount}
              onChange={(e) => setAdminApprovedAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              required
            />
            <div className="flex space-x-4">
              <button
                onClick={handleApprove}
                className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 flex items-center justify-center transform hover:scale-105 transition-transform duration-200"
              >
                <FaCheck className="mr-2" /> Approve
              </button>
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 flex items-center justify-center transform hover:scale-105 transition-transform duration-200"
              >
                <FaTimes className="mr-2" /> Reject
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-3xl overflow-auto">
            <div className="relative">
              {imageLoading ? (
                <div className="flex items-center justify-center h-96 w-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading image...</p>
                  </div>
                </div>
              ) : (
                <img 
                  src={`data:image/jpeg;base64,${base64}`} 
                  alt="Proof" 
                  className="max-w-full max-h-96"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageLoaded(false);
                    alert('Failed to display image. Please try again.');
                  }}
                />
              )}
            </div>
            <button
              onClick={() => {
                setShowModal(false);
                setImageLoaded(false);
              }}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentRequestDetail;