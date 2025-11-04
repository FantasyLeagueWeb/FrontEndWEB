import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import contestService from '../../services/contestService';
import paymentService from '../../services/paymentService';
import { FaEdit, FaTrash } from 'react-icons/fa';
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
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleCreateFantasyTeam = async () => {
    try {
      const data = await paymentService.getBalance();
      const balance = data; // Assuming the response has a 'balance' field
      console.log('User balance:', balance); // Debug log
      if (balance < contest.entryFee) {
        setShowInsufficientBalance(true);
      } else {
        console.log('Navigating with contest data:', contest); // Debug log
        navigate(`/fantasy-teams/create/${id}`, { state: { contest } });
      }
    } catch (error) {
      console.error('Failed to fetch balance', error);
      // Optionally handle error, e.g., show a message
    }
  };

  const handleRecharge = () => {
    setShowInsufficientBalance(false);
    navigate('/payments/add'); // Assuming the payment form screen route is '/recharge'; adjust if needed
  };

  const handleCloseModal = () => {
    setShowInsufficientBalance(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await contestService.deleteContest(id);
      navigate('/contests');
    } catch (error) {
      console.error('Failed to delete contest', error);
      alert('Failed to delete contest');
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
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
          <p className="text-gray-700 text-lg">
            <strong>Status:</strong>{' '}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
              contest.contestStatus === 'Finished' ? 'bg-green-50 text-green-700' :
              contest.contestStatus === 'Live' ? 'bg-red-50 text-red-700' :
              contest.contestStatus === 'Upcoming' ? 'bg-blue-50 text-blue-700' :
              'bg-gray-50 text-gray-700'
            }`}>
              {contest.contestStatus || 'N/A'}
            </span>
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

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {user?.role?.toLowerCase() === 'admin' && (
            <>
              <Link
                to={`/contests/edit/${id}`}
                className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center transform hover:scale-105 text-sm sm:text-base whitespace-nowrap"
              >
                <FaEdit className="mr-2" />
                Edit Contest
              </Link>
              <button
                onClick={handleDeleteClick}
                className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-red-700 transition-colors duration-200 flex items-center justify-center transform hover:scale-105 text-sm sm:text-base whitespace-nowrap"
              >
                <FaTrash className="mr-2" />
                Delete Contest
              </button>
            </>
          )}
          
          {contest.contestStatus === 'Finished' && (
            <Link
              to={`/contests/${id}/winners`}
              className="bg-yellow-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-yellow-700 transition-colors duration-200 flex items-center justify-center transform hover:scale-105 text-sm sm:text-base whitespace-nowrap"
            >
              🏆 View Winners
            </Link>
          )}
          
          <button
            onClick={handleCreateFantasyTeam}
            className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-green-700 transition-colors duration-200 flex items-center justify-center transform hover:scale-105 text-sm sm:text-base whitespace-nowrap"
          >
            Create Fantasy Team
          </button>
        </div>
      </div>

      {showInsufficientBalance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-sm w-full mx-4"
          >
            <h3 className="text-xl font-semibold mb-4 text-red-600">Insufficient Balance</h3>
            <p className="text-gray-700 mb-6">You don't have sufficient balance. Please recharge.</p>
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors w-full sm:w-auto"
              >
                Close
              </button>
              <button
                onClick={handleRecharge}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                Recharge
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <FaTrash className="text-red-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Delete Contest</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this contest? This action cannot be undone. The contest will be marked as deleted and will no longer be visible in the contest list.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4">
              <button
                onClick={handleDeleteCancel}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium w-full sm:w-auto"
              >
                Delete Contest
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ContestDetail;