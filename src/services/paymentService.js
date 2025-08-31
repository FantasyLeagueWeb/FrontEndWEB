// Frontend: Updated paymentService.js (renamed internals to recharge for clarity)

import api from './api';

const paymentService = {
  getAllPayments: async () => {
    const response = await api.get('/payment');
    return response.data;
  },
  getPaymentById: async (id) => {
    const response = await api.get(`/payment/${id}`);
    return response.data;
  },
  addPayment: async (formData) => {
    const response = await api.post('/payment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  approvePayment: async (id, amount) => {
    debugger
    await api.post(`/payment/${id}/approve`, { adminApprovedAmount: amount });
  },
  rejectPayment: async (id) => {
    await api.post(`/payment/${id}/reject`);
  },
  getMyPayments: async () => {
    const response = await api.get('/payment/my-payments');
    return response.data;
  },
  getImageBase64: async (id) => {
    const response = await api.get(`/payment/image/${id}`);
    return response.data;
  },
  getBalance: async () => {
    const response = await api.get('/payment/balance');
    return response.data;
  },
};

export default paymentService;