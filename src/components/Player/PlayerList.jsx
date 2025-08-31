import React, { useState, useEffect } from 'react';
import playerService from '../../services/playerService';
import { Link } from 'react-router-dom';
import { FaPlus, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SearchBar from '../Shared/SearchBar';

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await playerService.getAllPlayers();
        setPlayers(data);
      } catch (error) {
        console.error('Failed to fetch players', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Loading players...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900 flex items-center justify-center">
        <FaUser className="mr-2" /> Players
      </h2>
      <div className="flex justify-between items-center mb-6">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Link to="/players/add" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center transform hover:scale-105 transition-transform duration-200">
          <FaPlus className="mr-2" /> Add Player
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <div
              key={player.playerId}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link
                to={`/players/${player.playerId}`}
                className="text-2xl font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
              >
                <FaUser className="mr-2" /> {player.name}
              </Link>
              <p className="text-gray-700 mt-2 text-lg">Team: {player.teamId}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No players found.</p>
        )}
      </motion.div>
    </div>
  );
};

export default PlayerList;