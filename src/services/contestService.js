import api from './api';

const contestService = {
  getAllContests: async (params = {}) => {
    const response = await api.get('/contest', { params });
    return response.data;
  },
  getContestById: async (id) => {
    const response = await api.get(`/contest/${id}`);
    return response.data;
  },
  addContest: async (contest) => {
    const response = await api.post('/contest', contest);
    return response.data;
  },
  updateContest: async (contest) => {
    await api.put('/contest', contest);
  },
  deleteContest: async (id) => {
    await api.delete(`/contest/${id}`);
  },
  declareWinners: async (id) => {
    await api.post(`/contest/${id}/declare-winners`);
  },
  getContestRankings: async (id) => {
    const response = await api.get(`/contest/${id}/rankings`);
    return response.data;
  },
};

export default contestService;