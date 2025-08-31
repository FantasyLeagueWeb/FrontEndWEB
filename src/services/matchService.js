// Updated matchService (frontend)
import api from './api';

const matchService = {
  getAllMatches: async () => {
    const response = await api.get('/match');
    return response.data;
  },
  getMatchById: async (id) => {
    const response = await api.get(`/match/${id}`);
    return response.data;
  },
  addMatch: async (match) => {
    const response = await api.post('/match', match);
    return response.data;
  },
  updateMatch: async (match) => {
    await api.put('/match', match);
  },
  deleteMatch: async (id) => {
    await api.delete(`/match/${id}`);
  },
  getFixturesByLeague: async (leagueId) => {
    const response = await api.get(`/match/fixtures/${leagueId}`);
    return response.data;
  },
};

export default matchService;