import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import playerService from '../../services/playerService';
import { FaSave, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


const PlayerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState({ name: '', teamId: '' });

  useEffect(() => {
    if (id) {
      const fetchPlayer = async () => {
        try {
          const data = await playerService.getPlayerById(id);
          setPlayer(data);
        } catch (error) {
          console.error('Failed to fetch player', error);
        }
      };
      fetchPlayer();
    }
  }, [id]);

  const handleChange = (e) => {
    setPlayer({ ...player, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await playerService.updatePlayer(player);
      } else {
        await playerService.addPlayer(player);
      }
      navigate('/players');
    } catch (error) {
      console.error('Failed to save player', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-10 min-h-screen"
    >
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">{id ? 'Edit Player' : 'Add Player'}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Player Name"
              value={player.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="teamId">Team ID</label>
            <input
              type="text"
              id="teamId"
              name="teamId"
              placeholder="Team ID"
              value={player.teamId}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center transform hover:scale-105"
            >
              <FaSave className="mr-2" /> Save
            </button>
            <Link
              to="/players"
              className="flex-1 bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center transform hover:scale-105"
            >
              <FaTimes className="mr-2" /> Cancel
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerForm;