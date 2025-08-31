import api from './api';

const fantasyTeamService = {
  getAllFantasyTeams: async () => {
    const response = await api.get('/fantasyteam');
    return response.data;
  },
  getFantasyTeamById: async (id) => {
    const response = await api.get(`/fantasyteam/${id}`);
    return response.data;
  },
  addFantasyTeam: async (team) => {
    const response = await api.post('/fantasyteam', team);
    return response.data;
  },
  updateFantasyTeam: async (team) => {
    await api.put('/fantasyteam', team);
  },
  deleteFantasyTeam: async (id) => {
    await api.delete(`/fantasyteam/${id}`);
  },
  getFantasyTeamPoints: async (id) => {
    const response = await api.get(`/fantasyteam/${id}/points`);
    return response.data;
  },
};

export default fantasyTeamService;