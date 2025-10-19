import React, { useState, useEffect } from 'react';
import { FaEye, FaDownload, FaClock, FaCheck, FaTimes, FaImage } from 'react-icons/fa';
import { motion } from 'framer-motion';
import withdrawalService from '../../services/withdrawalService';

const WithdrawalHistory = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [base64, setBase64] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      console.log('WithdrawalHistory: Fetching user withdrawal requests');
      const data = await withdrawalService.getUserWithdrawalRequests();
      console.log('WithdrawalHistory: Received data:', data);
      setWithdrawals(data);
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewImage = async (withdrawal) => {
    try {
      const base64Data = await withdrawalService.getWithdrawalImageBase64(withdrawal.requestId);
      setBase64(base64Data);
      setSelectedWithdrawal(withdrawal);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch image', error);
      alert('Failed to load image');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <FaClock className="text-yellow-500" />;
      case 'Approved': return <FaCheck className="text-green-500" />;
      case 'Rejected': return <FaTimes className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Loading withdrawal history...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-10 min-h-screen bg-gray-100"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Withdrawal History</h1>
          <p className="text-gray-600">Track your withdrawal requests and payment status</p>
        </div>

        <div className="space-y-6">
          {withdrawals.length > 0 ? (
            withdrawals.map((withdrawal) => (
              <motion.div
                key={withdrawal.requestId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {getStatusIcon(withdrawal.status)}
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Contest #{withdrawal.contestId} - {withdrawal.rank} Place
                      </h3>
                      <p className="text-sm text-gray-500">
                        Requested on {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      Rs {withdrawal.prizeAmount?.toLocaleString()}
                    </p>
                    <span className={'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + getStatusColor(withdrawal.status)}>
                      {withdrawal.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Bank Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Bank:</strong> {withdrawal.bankName}</p>
                      <p><strong>Account:</strong> {withdrawal.accountNumber}</p>
                      <p><strong>Holder:</strong> {withdrawal.accountHolderName}</p>
                      <p><strong>Phone:</strong> {withdrawal.phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Payment Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Amount:</strong> Rs {withdrawal.prizeAmount?.toLocaleString()}</p>
                      <p><strong>Status:</strong> {withdrawal.status}</p>
                      {withdrawal.processedAt && (
                        <p><strong>Processed:</strong> {new Date(withdrawal.processedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>

                {withdrawal.adminScreenshotUrl && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Payment Proof</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg border flex items-center justify-center">
                        <FaImage className="text-gray-400 text-2xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Transaction screenshot uploaded by admin</p>
                        <button
                          onClick={() => handleViewImage(withdrawal)}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          <FaEye className="mr-1" />
                          View Screenshot
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {withdrawal.status === 'Pending' && (
                  <div className="border-t pt-4">
                    <div className="flex items-center text-yellow-600">
                      <FaClock className="mr-2" />
                      <span className="text-sm font-medium">Your withdrawal request is being processed</span>
                    </div>
                  </div>
                )}

                {withdrawal.status === 'Approved' && (
                  <div className="border-t pt-4">
                    <div className="flex items-center text-green-600">
                      <FaCheck className="mr-2" />
                      <span className="text-sm font-medium">Payment has been processed successfully</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">💳</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Withdrawals Yet</h3>
              <p className="text-gray-500">You haven't made any withdrawal requests yet.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-3xl overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Transaction Screenshot</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            {base64 && (
              <img 
                src={`data:image/jpeg;base64,${base64}`} 
                alt="Transaction proof" 
                className="max-w-full max-h-96 object-contain" 
              />
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WithdrawalHistory;
