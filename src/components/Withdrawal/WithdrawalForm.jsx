import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaUser, FaPhone, FaBuilding } from 'react-icons/fa';
import { motion } from 'framer-motion';
import withdrawalService from '../../services/withdrawalService';
import contestWinnerService from '../../services/contestWinnerService';
import { useToast } from '../Shared/Toast';

const WithdrawalForm = ({ contestId, fantasyTeamId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { success, error: showError } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get user winnings to find the correct winning entry
      const winnings = await contestWinnerService.getUserWinnings();
      const contestWinning = winnings.find(w => 
        w.contestId === parseInt(contestId) && 
        w.fantasyTeamId === parseInt(fantasyTeamId)
      );

      if (!contestWinning) {
        throw new Error('No winning found for this contest and fantasy team');
      }

      // Create withdrawal request using the service
      const withdrawalRequest = {
        contestId: parseInt(contestId),
        rank: contestWinning.rank,
        prizeAmount: contestWinning.prizeAmount,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountHolderName: formData.accountHolderName,
        phoneNumber: formData.phoneNumber,
      };

      const result = await withdrawalService.createWithdrawalRequest(withdrawalRequest);
      success('Withdrawal Request Submitted!', 'Your withdrawal request has been submitted successfully. We will process it soon.');
      onSuccess(result);
    } catch (error) {
      console.error('Withdrawal request failed:', error);
      const errorMessage = error.response?.data || error.message || 'Failed to create withdrawal request';
      setError(errorMessage);
      showError('Withdrawal Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Withdrawal Request</h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-yellow-600 mr-3">⚠️</div>
              <div>
                <p className="text-sm text-yellow-800 font-medium">Important</p>
                <p className="text-sm text-yellow-700">
                  Please ensure your bank details are correct. Incorrect information may delay your payment.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaBuilding className="inline mr-2" />
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter bank name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCreditCard className="inline mr-2" />
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter account number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2" />
                Account Holder Name
              </label>
              <input
                type="text"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter account holder name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPhone className="inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Submitting...' : 'Apply Withdraw'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WithdrawalForm;
