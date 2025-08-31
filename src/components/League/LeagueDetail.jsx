import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import leagueService from '../../services/leagueService';
import { FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LeagueDetail = () => {
  const { id } = useParams();
  const [league, setLeague] = useState(null);

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const data = await leagueService.getLeagueById(id);
        setLeague(data);
      } catch (error) {
        console.error('Failed to fetch league', error);
      }
    };
    fetchLeague();
  }, [id]);

  if (!league) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Loading league details...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-10 min-h-screen"
    >
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <img
            src={`https://via.placeholder.com/100?text=${league.name}`}
            alt={league.name}
            className="w-24 h-24 rounded-full mr-4"
          />
          <h2 className="text-3xl font-bold text-gray-900">{league.name}</h2>
        </div>
        <p className="text-gray-700 text-lg mb-2"><strong>League Format:</strong> {league.format}</p>
        <div className="mt-6">
          <Link
            to={`/leagues/edit/${id}`}
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200 flex items-center transform hover:scale-105"
          >
            <FaEdit className="mr-2" /> Edit League
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default LeagueDetail;