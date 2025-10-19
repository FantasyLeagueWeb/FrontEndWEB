import api from './api';

const forgotPasswordService = {
  sendVerificationCode: async (email) => {
    const response = await api.post('/forgotpassword/send-code', { email });
    return response.data;
  },

  verifyCode: async (email, verificationCode) => {
    const response = await api.post('/forgotpassword/verify-code', { 
      email, 
      verificationCode 
    });
    return response.data;
  },

  resetPassword: async (email, verificationCode, newPassword, confirmPassword) => {
    const response = await api.post('/forgotpassword/reset-password', {
      email,
      verificationCode,
      newPassword,
      confirmPassword
    });
    return response.data;
  }
};

export default forgotPasswordService;
