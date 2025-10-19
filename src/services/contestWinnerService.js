import api from './api';

const contestWinnerService = {
  getContestWinners: async (contestId) => {
    const response = await api.get(`/contestwinner/contest/${contestId}`);
    return response.data;
  },

  getUserWinnings: async () => {
    const response = await api.get('/contestwinner/user-winnings');
    return response.data;
  },

  isUserWinner: async (contestId) => {
    const response = await api.get(`/contestwinner/is-winner/${contestId}`);
    return response.data;
  }
};

export default contestWinnerService;
