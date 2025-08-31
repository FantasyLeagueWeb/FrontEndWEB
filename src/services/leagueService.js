import api from './api';

const leagueService = {
  getAllLeagues: async () => {
    const response = await api.get('/league');
    return response.data;
  },
  getLeagueById: async (id) => {
    const response = await api.get(`/league/${id}`);
    return response.data;
  },
  addLeague: async (league) => {
    const response = await api.post('/league', league);
    return response.data;
  },
  updateLeague: async (league) => {
    await api.put('/league', league);
  },
  deleteLeague: async (id) => {
    await api.delete(`/league/${id}`);
  },
};

export default leagueService;