import React, { useState, useEffect } from 'react';
import teamService from '../../services/teamService';
import { Link } from 'react-router-dom';
import { FaPlus, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SearchBar from '../Shared/SearchBar';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await teamService.getAllTeams();
        setTeams(data);
      } catch (error) {
        console.error('Failed to fetch teams', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Loading teams...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900 flex items-center justify-center">
        <FaUsers className="mr-2" /> Teams
      </h2>
      <div className="flex justify-between items-center mb-6">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Link to="/teams/add" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center transform hover:scale-105 transition-transform duration-200">
          <FaPlus className="mr-2" /> Add Team
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <div
              key={team.teamId}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link
                to={`/teams/${team.teamId}`}
                className="text-2xl font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
              >
                <FaUsers className="mr-2" /> {team.name}
              </Link>
              <p className="text-gray-700 mt-2 text-lg">League: {team.leagueId}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No teams found.</p>
        )}
      </motion.div>
    </div>
  );
};

export default TeamList;