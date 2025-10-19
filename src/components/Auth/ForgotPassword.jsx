import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaKey, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import forgotPasswordService from '../../services/forgotPasswordService';
import { useToast } from '../Shared/Toast';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Verify Code, 3: Reset Password, 4: Success
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { success: showSuccess, error: showError, info } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await forgotPasswordService.sendVerificationCode(formData.email);
      if (result.success) {
        showSuccess('Verification Code Sent!', result.message);
        setStep(2);
      } else {
        showError('Failed to Send Code', result.message);
      }
    } catch (error) {
      showError('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await forgotPasswordService.verifyCode(formData.email, formData.verificationCode);
      if (result.success) {
        showSuccess('Code Verified!', result.message);
        setStep(3);
      } else {
        showError('Verification Failed', result.message);
      }
    } catch (error) {
      showError('Error', 'Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      showError('Password Mismatch', 'Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const result = await forgotPasswordService.resetPassword(
        formData.email,
        formData.verificationCode,
        formData.newPassword,
        formData.confirmPassword
      );
      
      if (result.success) {
        showSuccess('Password Reset Successful!', result.message);
        setStep(4);
      } else {
        showError('Reset Failed', result.message);
      }
    } catch (error) {
      showError('Error', 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = '/login';
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8"
    >
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <FaEnvelope className="text-2xl text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
        <p className="text-gray-600">Enter your email address and we'll send you a verification code.</p>
      </div>

      <form onSubmit={handleSendCode} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? 'Sending...' : 'Send Verification Code'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          <FaArrowLeft className="inline mr-1" />
          Back to Login
        </Link>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8"
    >
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <FaKey className="text-2xl text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
        <p className="text-gray-600">We've sent a 6-digit code to <strong>{formData.email}</strong></p>
      </div>

      <form onSubmit={handleVerifyCode} className="space-y-6">
        <div>
          <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <div className="relative">
            <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="verificationCode"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleInputChange}
              required
              maxLength="6"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
              placeholder="000000"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setStep(1)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <FaArrowLeft className="inline mr-1" />
          Back to Email
        </button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8"
    >
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <FaCheck className="text-2xl text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Password</h2>
        <p className="text-gray-600">Enter your new password below.</p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-6">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            required
            minLength="6"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            minLength="6"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Confirm new password"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setStep(2)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <FaArrowLeft className="inline mr-1" />
          Back to Verification
        </button>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center"
    >
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <FaCheck className="text-2xl text-green-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
      <p className="text-gray-600 mb-8">Your password has been reset successfully. You can now log in with your new password.</p>
      
      <button
        onClick={handleBackToLogin}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
      >
        Go to Login
      </button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </div>
  );
};

export default ForgotPassword;
