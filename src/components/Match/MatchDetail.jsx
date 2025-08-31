// Updated MatchDetail component (frontend)
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import matchService from '../../services/matchService';
import { FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const data = await matchService.getMatchById(id);
        setMatch(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch match', error);
        setError('Failed to load match details. Please try again later.');
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  const handleCreateContest = () => {
    navigate('/contests/add', { state: { match } });
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Loading match details...</p>
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

  if (!match) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Match not found.</p>
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
              src={match.localTeam?.logo || 'https://via.placeholder.com/100?text=Team1'}
              alt={match.localTeam?.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <span className="text-3xl font-bold text-gray-900">VS</span>
            <img
              src={match.visitorTeam?.logo || 'https://via.placeholder.com/100?text=Team2'}
              alt={match.visitorTeam?.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{match.name}</h2>
          <p className="text-gray-700 text-lg mt-2">
            <strong>Date:</strong> {formatDate(match.date)}
          </p>
          <p className="text-gray-700 text-lg">
            <strong>Venue:</strong> {match.venue}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Local Team Players */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-50 p-6 rounded-lg shadow"
          >
            <h3 className="text-2xl font-semibold mb-4">{match.localTeam?.name} Squad</h3>
            {match.localTeam?.players?.length > 0 ? (
              <ul className="space-y-4">
                {match.localTeam.players.map((player) => (
                  <li key={player.id} className="flex items-center border-b pb-2">
                    <img
                      src={player.image || 'https://via.placeholder.com/40?text=P'}
                      alt={player.fullname}
                      className="w-10 h-10 rounded-full mr-4 object-cover"
                    />
                    <div className="flex justify-between flex-1">
                      <div>
                        <p className="font-medium">{player.fullname}</p>
                        <p className="text-sm text-gray-600">{player.position}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          DOB: {player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString() : 'N/A'}
                        </p>
                        {player.dateOfBirth && (
                          <p className="text-sm text-gray-600">
                            Age: {calculateAge(player.dateOfBirth)}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Lineup not available yet. Check closer to match start.</p>
            )}
          </motion.div>

          {/* Visitor Team Players */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-50 p-6 rounded-lg shadow"
          >
            <h3 className="text-2xl font-semibold mb-4">{match.visitorTeam?.name} Squad</h3>
            {match.visitorTeam?.players?.length > 0 ? (
              <ul className="space-y-4">
                {match.visitorTeam.players.map((player) => (
                  <li key={player.id} className="flex items-center border-b pb-2">
                    <img
                      src={player.image || 'https://via.placeholder.com/40?text=P'}
                      alt={player.fullname}
                      className="w-10 h-10 rounded-full mr-4 object-cover"
                    />
                    <div className="flex justify-between flex-1">
                      <div>
                        <p className="font-medium">{player.fullname}</p>
                        <p className="text-sm text-gray-600">{player.position}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          DOB: {player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString() : 'N/A'}
                        </p>
                        {player.dateOfBirth && (
                          <p className="text-sm text-gray-600">
                            Age: {calculateAge(player.dateOfBirth)}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Lineup not available yet. Check closer to match start.</p>
            )}
          </motion.div>
        </div>

        <div className="text-center flex justify-center space-x-4">
          {/* <Link
            to={`/matches/edit/${id}`}
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200 flex items-center transform hover:scale-105"
          >
            <FaEdit className="mr-2" /> Edit Match
          </Link> */}
          <button
            onClick={handleCreateContest}
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors duration-200 flex items-center transform hover:scale-105"
          >
            Create Contest
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchDetail;