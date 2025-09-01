// src/services/userService.js
import api from './api';

const userService = {
  getAllUsers: async () => {
    const response = await api.get('/user');
    return response.data;
  },
  getUserById: async (id) => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },
  addUser: async (user) => {
    const response = await api.post('/user', user);
    return response.data;
  },
  updateUser: async (user) => {
    await api.put('/user', user);
  },
  deleteUser: async (id) => {
    await api.delete(`/user/${id}`);
  },
};

export default userService;