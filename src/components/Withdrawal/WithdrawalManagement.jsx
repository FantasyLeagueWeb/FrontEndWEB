import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaUpload, FaEye, FaDownload, FaImage } from 'react-icons/fa';
import { motion } from 'framer-motion';
import withdrawalService from '../../services/withdrawalService';
import { useToast } from '../Shared/Toast';

const WithdrawalManagement = () => {
  const { success, error } = useToast();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [base64, setBase64] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      console.log('WithdrawalManagement: Fetching all withdrawal requests');
      const data = await withdrawalService.getAllWithdrawalRequests();
      console.log('WithdrawalManagement: Received data:', data);
      setWithdrawals(data);
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessWithdrawal = async () => {
    if (!screenshotFile) {
      alert('Please upload a transaction screenshot');
      return;
    }

    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('screenshot', screenshotFile);

      console.log('WithdrawalManagement: Processing withdrawal with file:', screenshotFile.name);
      await withdrawalService.processWithdrawalRequestWithFile(selectedWithdrawal.requestId, formData);
      
      success('Withdrawal Processed!', 'Withdrawal has been processed successfully with payment proof.');
      setShowProcessModal(false);
      setSelectedWithdrawal(null);
      setScreenshotFile(null);
      fetchWithdrawals();
    } catch (err) {
      console.error('Failed to process withdrawal:', err);
      console.error('Error details:', err.response?.data || err.message);
      error('Withdrawal Processing Failed', err.message || 'Failed to process withdrawal. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleViewImage = async (withdrawal) => {
    setImageLoading(true);
    try {
      console.log('WithdrawalManagement: Fetching image for withdrawal:', withdrawal.requestId);
      const base64Data = await withdrawalService.getWithdrawalImageBase64(withdrawal.requestId);
      console.log('WithdrawalManagement: Received base64 data:', base64Data ? 'Yes' : 'No');
      setBase64(base64Data);
      setSelectedWithdrawal(withdrawal);
      setShowImageModal(true);
    } catch (error) {
      console.error('Failed to fetch image:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert('Failed to load image');
    } finally {
      setImageLoading(false);
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
        <p className="text-xl text-gray-600 animate-pulse">Loading withdrawal requests...</p>
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Withdrawal Management</h1>
          <p className="text-gray-600">Manage user withdrawal requests and process payments</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Contest</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Bank Details</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.requestId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">User #{withdrawal.userId}</p>
                        <p className="text-sm text-gray-500">{withdrawal.phoneNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">Contest #{withdrawal.contestId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {withdrawal.rank} Place
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-green-600">Rs {withdrawal.prizeAmount?.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium">{withdrawal.bankName}</p>
                        <p className="text-gray-500">{withdrawal.accountNumber}</p>
                        <p className="text-gray-500">{withdrawal.accountHolderName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + getStatusColor(withdrawal.status)}>
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {withdrawal.status === 'Pending' && (
                          <button
                            onClick={() => {
                              setSelectedWithdrawal(withdrawal);
                              setShowProcessModal(true);
                            }}
                            className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                          >
                            <FaCheck className="mr-1" />
                            Process
                          </button>
                        )}
                        {withdrawal.adminScreenshotUrl && (
                          <button
                            onClick={() => handleViewImage(withdrawal)}
                            disabled={imageLoading}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            {imageLoading ? (
                              <>
                                <FaImage className="mr-1 animate-spin" />
                                Loading...
                              </>
                            ) : (
                              <>
                                <FaEye className="mr-1" />
                                View Screenshot
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {withdrawals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No withdrawal requests found</p>
            </div>
          )}
        </div>
      </div>

      {/* Process Withdrawal Modal */}
      {showProcessModal && selectedWithdrawal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Process Withdrawal</h3>
                <button
                  onClick={() => setShowProcessModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Withdrawal Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>User:</strong> User #{selectedWithdrawal.userId}</p>
                  <p><strong>Amount:</strong> Rs {selectedWithdrawal.prizeAmount?.toLocaleString()}</p>
                  <p><strong>Bank:</strong> {selectedWithdrawal.bankName}</p>
                  <p><strong>Account:</strong> {selectedWithdrawal.accountNumber}</p>
                  <p><strong>Holder:</strong> {selectedWithdrawal.accountHolderName}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Transaction Screenshot
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setScreenshotFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {screenshotFile && (
                  <p className="text-sm text-green-600 mt-1">File selected: {screenshotFile.name}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowProcessModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessWithdrawal}
                  disabled={processing || !screenshotFile}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing ? 'Processing...' : 'Process Payment'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Image View Modal */}
      {showImageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg max-w-4xl max-h-4xl overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Transaction Screenshot</h3>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setBase64(null);
                  setSelectedWithdrawal(null);
                }}
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
                onClick={() => {
                  setShowImageModal(false);
                  setBase64(null);
                  setSelectedWithdrawal(null);
                }}
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

export default WithdrawalManagement;
