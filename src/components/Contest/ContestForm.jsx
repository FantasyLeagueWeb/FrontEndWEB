// Updated ContestForm component (frontend) with fixes for edit mode: populate player credits and set matchDetails from fetched contest data
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import contestService from '../../services/contestService';
import matchService from '../../services/matchService';
import { FaSave, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useToast } from '../Shared/Toast';

const ContestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error } = useToast();
  const [contest, setContest] = useState({
    name: '',
    matchId: '',
    entryFee: '',
    maxParticipants: '',
    firstPrizeWinners: '',
    secondPrizeWinners: '',
    thirdPrizeWinners: '',
    firstPrizeAmount: '',
    secondPrizeAmount: '',
    thirdPrizeAmount: '',
    date: '',
    venue: ''
  });
  const [matchDetails, setMatchDetails] = useState(null);
  const [playerCredits, setPlayerCredits] = useState({});
  const [loadingMatch, setLoadingMatch] = useState(false);

  useEffect(() => {
    const passedMatch = location.state?.match;
    if (!id && passedMatch) {
      setMatchDetails(passedMatch);
      setContest((prev) => ({ ...prev, matchId: passedMatch.matchId || passedMatch.externalMatchId || '',
        date: passedMatch.date || '',
      venue: passedMatch.venue || ''
       }));
    }
  }, [id, location.state]);

  useEffect(() => {
    if (id) {
      const fetchContest = async () => {
        try {
          const data = await contestService.getContestById(id);
          setContest(data);

          // Populate playerCredits from fetched contest data
          const credits = {};
          if (data.localTeam?.players) {
            data.localTeam.players.forEach(player => {
              credits[player.apiPlayerId] = player.credits;
            });
          }
          if (data.visitorTeam?.players) {
            data.visitorTeam.players.forEach(player => {
              credits[player.apiPlayerId] = player.credits;
            });
          }
          setPlayerCredits(credits);

          // Set matchDetails from fetched contest data (mapping fields accordingly)
          setMatchDetails({
            localTeam: data.localTeam ? {
              name: data.localTeam.name,
              logo: data.localTeam.apiTeamImage || data.localTeam.logo,
              id: data.localTeam.apiTeamId,
              players: data.localTeam.players.map(player => ({
                id: player.apiPlayerId,
                fullname: player.name,
                position: player.role,
                image: player.imagePath
              }))
            } : null,
            visitorTeam: data.visitorTeam ? {
              name: data.visitorTeam.name,
              logo: data.visitorTeam.apiTeamImage || data.visitorTeam.logo,
              id: data.visitorTeam.apiTeamId,
              players: data.visitorTeam.players.map(player => ({
                id: player.apiPlayerId,
                fullname: player.name,
                position: player.role,
                image: player.imagePath
              }))
            } : null
          });
        } catch (error) {
          console.error('Failed to fetch contest', error);
        }
      };
      fetchContest();
    }
  }, [id]);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (contest.matchId) {
        setLoadingMatch(true);
        try {
          const data = await matchService.getMatchById(contest.matchId);
          setMatchDetails(data);
        } catch (error) {
          console.error('Failed to fetch match details', error);
        } finally {
          setLoadingMatch(false);
        }
      }
    };
    // Only fetch if not in edit mode (id present) and matchDetails not already set
    if (contest.matchId && !matchDetails && !id) {
      fetchMatchDetails();
    }
  }, [contest.matchId, matchDetails, id]);

  const handleChange = (e) => {
    setContest({ ...contest, [e.target.name]: e.target.value });
  };

  const handleCreditChange = (playerId, value) => {
    setPlayerCredits((prev) => ({ ...prev, [playerId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        contest: {
          contestId: id ? parseInt(id) : 0,
          matchId: contest.matchId,
          entryFee: parseFloat(contest.entryFee),
          maxParticipants: parseInt(contest.maxParticipants),
          firstPrizeWinners: parseInt(contest.firstPrizeWinners),
          secondPrizeWinners: parseInt(contest.secondPrizeWinners),
          thirdPrizeWinners: parseInt(contest.thirdPrizeWinners),
          firstPrizeAmount: parseFloat(contest.firstPrizeAmount),
          secondPrizeAmount: parseFloat(contest.secondPrizeAmount),
          thirdPrizeAmount: parseFloat(contest.thirdPrizeAmount),
          date: contest.date,                   
          venue: contest.venue
        },
        localTeam: matchDetails ? {
          name: matchDetails.localTeam.name,
          apiTeamImage: matchDetails.localTeam.logo,
          apiTeamId: matchDetails.localTeam.id,
          players: matchDetails.localTeam.players.map(player => ({
            apiPlayerId: player.id,
            name: player.fullname,
            role: player.position,
            imagePath: player.image,
            credits: parseFloat(playerCredits[player.id] || 0)
          }))
        } : null,
        visitorTeam: matchDetails ? {
          name: matchDetails.visitorTeam.name,
          apiTeamImage: matchDetails.visitorTeam.logo,
          apiTeamId: matchDetails.visitorTeam.id,
          players: matchDetails.visitorTeam.players.map(player => ({
            apiPlayerId: player.id,
            name: player.fullname,
            role: player.position,
            imagePath: player.image,
            credits: parseFloat(playerCredits[player.id] || 0)
          }))
        } : null
      };

      if (id) {
        await contestService.updateContest(postData);
        success('Contest Updated!', 'Contest has been updated successfully.');
      } else {
        await contestService.addContest(postData);
        success('Contest Created!', 'New contest has been created successfully.');
      }

      navigate('/contests');
    } catch (err) {
      console.error('Failed to save contest', err);
      error('Contest Save Failed', err.message || 'Failed to save contest. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-10 min-h-screen"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">{id ? 'Edit Contest' : 'Add Contest'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="entryFee">Entry Fee</label>
              <input
                type="number"
                id="entryFee"
                name="entryFee"
                placeholder="Entry Fee"
                value={contest.entryFee}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="maxParticipants">Max Participants</label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                placeholder="Max Participants"
                value={contest.maxParticipants}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            {/* <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="firstPrizeWinners">First Prize Winners</label>
              <input
                type="number"
                id="firstPrizeWinners"
                name="firstPrizeWinners"
                placeholder="First Prize Winners"
                value={contest.firstPrizeWinners}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="secondPrizeWinners">Second Prize Winners</label>
              <input
                type="number"
                id="secondPrizeWinners"
                name="secondPrizeWinners"
                placeholder="Second Prize Winners"
                value={contest.secondPrizeWinners}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="thirdPrizeWinners">Third Prize Winners</label>
              <input
                type="number"
                id="thirdPrizeWinners"
                name="thirdPrizeWinners"
                placeholder="Third Prize Winners"
                value={contest.thirdPrizeWinners}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div> */}
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="firstPrizeAmount">First Prize Amount</label>
              <input
                type="number"
                id="firstPrizeAmount"
                name="firstPrizeAmount"
                placeholder="First Prize Amount"
                value={contest.firstPrizeAmount}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="secondPrizeAmount">Second Prize Amount</label>
              <input
                type="number"
                id="secondPrizeAmount"
                name="secondPrizeAmount"
                placeholder="Second Prize Amount"
                value={contest.secondPrizeAmount}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="thirdPrizeAmount">Third Prize Amount</label>
              <input
                type="number"
                id="thirdPrizeAmount"
                name="thirdPrizeAmount"
                placeholder="Third Prize Amount"
                value={contest.thirdPrizeAmount}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {loadingMatch && <p className="text-gray-600">Loading match details...</p>}

          {matchDetails && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4">Assign Credits to Players</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Local Team Players */}
                <div className="bg-gray-50 p-6 rounded-lg shadow max-h-96 overflow-y-auto">
                  <h4 className="text-xl font-semibold mb-4">{matchDetails.localTeam?.name} Players</h4>
                  {matchDetails.localTeam?.players?.map((player) => (
                    <div key={player.id} className="flex items-center mb-4">
                      <img
                        src={player.image || 'https://via.placeholder.com/40?text=P'}
                        alt={player.fullname}
                        className="w-10 h-10 rounded-full mr-4 object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{player.fullname} ({player.position})</p>
                      </div>
                      <input
                        type="number"
                        placeholder="Credit"
                        value={playerCredits[player.id] || ''}
                        onChange={(e) => handleCreditChange(player.id, e.target.value)}
                        className="w-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* Visitor Team Players */}
                <div className="bg-gray-50 p-6 rounded-lg shadow max-h-96 overflow-y-auto">
                  <h4 className="text-xl font-semibold mb-4">{matchDetails.visitorTeam?.name} Players</h4>
                  {matchDetails.visitorTeam?.players?.map((player) => (
                    <div key={player.id} className="flex items-center mb-4">
                      <img
                        src={player.image || 'https://via.placeholder.com/40?text=P'}
                        alt={player.fullname}
                        className="w-10 h-10 rounded-full mr-4 object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{player.fullname} ({player.position})</p>
                      </div>
                      <input
                        type="number"
                        placeholder="Credit"
                        value={playerCredits[player.id] || ''}
                        onChange={(e) => handleCreditChange(player.id, e.target.value)}
                        className="w-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center transform hover:scale-105"
            >
              <FaSave className="mr-2" /> Save
            </button>
            <Link
              to="/contests"
              className="flex-1 bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center transform hover:scale-105"
            >
              <FaTimes className="mr-2" /> Cancel
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ContestForm;