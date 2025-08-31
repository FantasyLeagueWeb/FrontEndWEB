import api from './api';

const playerService = {
  getAllPlayers: async () => {
    const response = await api.get('/player');
    return response.data;
  },
  getPlayerById: async (id) => {
    const response = await api.get(`/player/${id}`);
    return response.data;
  },
  addPlayer: async (player) => {
    const response = await api.post('/player', player);
    return response.data;
  },
  updatePlayer: async (player) => {
    await api.put('/player', player);
  },
  deletePlayer: async (id) => {
    await api.delete(`/player/${id}`);
  },
};

export default playerService;