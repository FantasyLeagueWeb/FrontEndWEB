import api from './api';

const withdrawalService = {
  createWithdrawalRequest: async (withdrawalData) => {
    const response = await api.post('/withdrawal/create', withdrawalData);
    return response.data;
  },

  getUserWithdrawalRequests: async () => {
    const response = await api.get('/withdrawal/user-requests');
    return response.data;
  },

  getAllWithdrawalRequests: async () => {
    const response = await api.get('/withdrawal/all-requests');
    return response.data;
  },

  processWithdrawalRequest: async (requestId, processData) => {
    const response = await api.post(`/withdrawal/process/${requestId}`, processData);
    return response.data;
  },

  processWithdrawalRequestWithFile: async (requestId, formData) => {
    const response = await api.post(`/withdrawal/process/${requestId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  canUserWithdraw: async (contestId, fantasyTeamId) => {
    const response = await api.get(`/withdrawal/can-withdraw/${contestId}?fantasyTeamId=${fantasyTeamId}`);
    return response.data;
  },

  getWithdrawalImageBase64: async (requestId) => {
    const response = await api.get(`/withdrawal/image/${requestId}`);
    return response.data;
  }
};

export default withdrawalService;
