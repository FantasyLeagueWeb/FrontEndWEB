import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import contestService from '../../services/contestService';
import { FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AuthContext } from '../../contexts/AuthContext';

const ContestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const data = await contestService.getContestById(id);
        console.log('Fetched contest data:', data); // Debug log
        setContest(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch contest', error);
        setError('Failed to load contest details. Please try again later.');
        setLoading(false);
      }
    };
    fetchContest();
  }, [id]);

  const handleCreateFantasyTeam = () => {
    console.log('Navigating with contest data:', contest); // Debug log
    navigate(`/fantasy-teams/create/${id}`, { state: { contest } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Loading contest details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Contest not found.</p>
      </div>
    );
  }

  const formatDate = (date) => new Date(date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-10 min-h-screen bg-gray-100"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img
              src={contest.localTeam?.apiTeamImage || 'https://via.placeholder.com/100?text=Team1'}
              alt={contest.localTeam?.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <span className="text-3xl font-bold text-gray-900">VS</span>
            <img
              src={contest.visitorTeam?.apiTeamImage || 'https://via.placeholder.com/100?text=Team2'}
              alt={contest.visitorTeam?.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{contest.localTeam?.name} vs {contest.visitorTeam?.name}</h2>
          <p className="text-gray-700 text-lg mt-2">
            <strong>Date:</strong> {contest.date ? formatDate(contest.date) : 'N/A'}
          </p>
          <p className="text-gray-700 text-lg">
            <strong>Venue:</strong> {contest.venue || 'N/A'}
          </p>
        </div>

        <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-semibold mb-4">Contest Details</h3>
          <p className="text-gray-700 text-lg">
            <strong>Entry Fee:</strong>{' '}
            <span className="font-medium">{Number(contest.entryFee).toLocaleString()} Rs</span>
          </p>
          <p className="text-gray-700 text-lg">
            <strong>Max Participants:</strong>{' '}
            <span className="font-medium">{contest.maxParticipants}</span>
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-gray-700 text-lg flex items-center">
              <span className="text-2xl mr-2">🥇</span>
              <strong className="mr-1">First Prize:</strong>
              <span className="text-green-600 font-medium">{Number(contest.firstPrizeAmount).toLocaleString()} Rs</span>
              <span className="text-sm text-gray-500 italic ml-2">
                – awarded to top {contest.firstPrizeWinners} {contest.firstPrizeWinners === 1 ? 'participant' : 'participants'}
              </span>
            </p>
            <p className="text-gray-700 text-lg flex items-center">
              <span className="text-2xl mr-2">🥈</span>
              <strong className="mr-1">Second Prize:</strong>
              <span className="text-yellow-600 font-medium">{Number(contest.secondPrizeAmount).toLocaleString()} Rs</span>
              <span className="text-sm text-gray-500 italic ml-2">
                – next {contest.secondPrizeWinners} {contest.secondPrizeWinners === 1 ? 'participant' : 'participants'}
              </span>
            </p>
            <p className="text-gray-700 text-lg flex items-center">
              <span className="text-2xl mr-2">🥉</span>
              <strong className="mr-1">Third Prize:</strong>
              <span className="text-orange-600 font-medium">{Number(contest.thirdPrizeAmount).toLocaleString()} Rs</span>
              <span className="text-sm text-gray-500 italic ml-2">
                – following {contest.thirdPrizeWinners} {contest.thirdPrizeWinners === 1 ? 'participant' : 'participants'}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-50 p-6 rounded-lg shadow"
          >
            <h3 className="text-2xl font-semibold mb-4">{contest.localTeam?.name} Players</h3>
            {contest.localTeam?.players?.length > 0 ? (
              <ul className="space-y-4">
                {contest.localTeam.players.map((player) => (
                  <li key={player.playerId || player.apiPlayerId} className="flex items-center border-b pb-2">
                    <img
                      src={player.imagePath || 'https://via.placeholder.com/40?text=P'}
                      alt={player.name}
                      className="w-10 h-10 rounded-full mr-4 object-cover"
                    />
                    <div className="flex justify-between flex-1">
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-gray-600">{player.role}</p>
                      </div>
                      <p className="text-sm text-gray-600">Credits: {player.credits}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No players available for {contest.localTeam?.name}.</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-50 p-6 rounded-lg shadow"
          >
            <h3 className="text-2xl font-semibold mb-4">{contest.visitorTeam?.name} Players</h3>
            {contest.visitorTeam?.players?.length > 0 ? (
              <ul className="space-y-4">
                {contest.visitorTeam.players.map((player) => (
                  <li key={player.playerId || player.apiPlayerId} className="flex items-center border-b pb-2">
                    <img
                      src={player.imagePath || 'https://via.placeholder.com/40?text=P'}
                      alt={player.name}
                      className="w-10 h-10 rounded-full mr-4 object-cover"
                    />
                    <div className="flex justify-between flex-1">
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-gray-600">{player.role}</p>
                      </div>
                      <p className="text-sm text-gray-600">Credits: {player.credits}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No players available for {contest.visitorTeam?.name}.</p>
            )}
          </motion.div>
        </div>

     <div className="flex justify-center mt-6 space-x-6">
  {user?.role?.toLowerCase() === 'admin' && (
    <Link
      to={`/contests/edit/${id}`}
      className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200 flex items-center transform hover:scale-105"
    >
      <FaEdit className="mr-2" />
      Edit Contest
    </Link>
  )}
  <button
    onClick={handleCreateFantasyTeam}
    className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors duration-200 flex items-center transform hover:scale-105"
  >
    Create Fantasy Team
  </button>
</div>

      </div>
    </motion.div>
  );
};

export default ContestDetail;



