import api from './api';

const paymentAccountService = {
  getActivePaymentAccounts: async () => {
    const response = await api.get('/paymentaccount/active');
    return response.data;
  },
  
  getPaymentAccount: async (id) => {
    const response = await api.get(`/paymentaccount/${id}`);
    return response.data;
  },
  
  createPaymentAccount: async (paymentAccountData) => {
    const response = await api.post('/paymentaccount', paymentAccountData);
    return response.data;
  },
  
  updatePaymentAccount: async (id, paymentAccountData) => {
    const response = await api.put(`/paymentaccount/${id}`, paymentAccountData);
    return response.data;
  },
  
  deletePaymentAccount: async (id) => {
    const response = await api.delete(`/paymentaccount/${id}`);
    return response.data;
  }
};

export default paymentAccountService;
