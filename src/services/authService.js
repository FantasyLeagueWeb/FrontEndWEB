import api from './api';

const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  register: async (firstName, lastName, phone, username, password, role) => {
    const response = await api.post('/auth/register', { firstName, lastName, phoneNumber: phone, username, password, role });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  getAllUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },
  registerAdmin: async (username, password) => {
    const response = await api.post('/auth/register-admin', { username, password });
    return response.data;
  },
};

export default authService;