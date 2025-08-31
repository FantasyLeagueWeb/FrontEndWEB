import api from './api';

const teamService = {
  getAllTeams: async () => {
    const response = await api.get('/team');
    return response.data;
  },
  getTeamById: async (id) => {
    const response = await api.get(`/team/${id}`);
    return response.data;
  },
  addTeam: async (team) => {
    const response = await api.post('/team', team);
    return response.data;
  },
  updateTeam: async (team) => {
    await api.put('/team', team);
  },
  deleteTeam: async (id) => {
    await api.delete(`/team/${id}`);
  },
};

export default teamService;