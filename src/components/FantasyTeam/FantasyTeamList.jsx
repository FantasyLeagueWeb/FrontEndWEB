// Updated FantasyTeamList component to display fantasy teams similar to ContestList, with match details
import React, { useState, useEffect } from 'react';
import fantasyTeamService from '../../services/fantasyTeamService';
import { Link } from 'react-router-dom';
import { FaUsers, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SearchBar from '../Shared/SearchBar';

const FantasyTeamList = () => {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await fantasyTeamService.getAllFantasyTeams();
        setTeams(data);
      } catch (error) {
        console.error('Failed to fetch teams', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const filteredTeams = searchTerm.trim()
    ? teams.filter(team =>
        team.localTeamName?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        team.visitorTeamName?.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    : teams;

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
        <FaUsers className="mr-2" /> Fantasy Teams
      </h2>
      <div className="flex justify-between items-center mb-6">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {/* <Link to="/fantasy-teams/add" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center transform hover:scale-105 transition-transform duration-200">
          <FaPlus className="mr-2" /> Add Team
        </Link> */}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <Link
              key={team.fantasyTeamId}
              to={`/fantasy-teams/${team.fantasyTeamId}`}
              className="block"
            >
              <div
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-around w-full mb-4">
                    <div className="flex flex-col items-center">
                      <img 
                        src={team.localTeamPic} 
                        alt={team.localTeamName} 
                        className="w-12 h-12 rounded-full object-cover mb-1" 
                      />
                      <span className="text-sm font-medium text-center">{team.localTeamName}</span>
                    </div>
                    <span className="font-bold text-xl">VS</span>
                    <div className="flex flex-col items-center">
                      <img 
                        src={team.visitorTeamPic} 
                        alt={team.visitorTeamName} 
                        className="w-12 h-12 rounded-full object-cover mb-1" 
                      />
                      <span className="text-sm font-medium text-center">{team.visitorTeamName}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg">Date: {team.date ? new Date(team.date).toLocaleString() : 'N/A'}</p>
                  <p className="text-gray-700 text-lg">Venue: {team.venue ? team.venue : 'N/A'}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No teams found.</p>
        )}
      </motion.div>
    </div>
  );
};

export default FantasyTeamList;