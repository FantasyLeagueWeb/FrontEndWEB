// Updated ContestList component
import React, { useState, useEffect } from 'react';
import contestService from '../../services/contestService';
import { Link } from 'react-router-dom';
import { FaTrophy, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SearchBar from '../Shared/SearchBar';

const ContestList = () => {
  const [contests, setContests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const data = await contestService.getAllContests();
        setContests(data);
      } catch (error) {
        console.error('Failed to fetch contests', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  const filteredContests = searchTerm.trim()
    ? contests.filter(contest =>
        contest.localTeamName?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        contest.visitorTeamName?.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    : contests;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Loading contests...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900 flex items-center justify-center">
        <FaTrophy className="mr-2" /> Contests
      </h2>
      <div className="flex justify-between items-center mb-6">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {/* <Link to="/contests/add" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center transform hover:scale-105 transition-transform duration-200">
          <FaPlus className="mr-2" /> Add Contest
        </Link> */}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredContests.length > 0 ? (
          filteredContests.map((contest) => (
            <Link
              key={contest.contestId}
              to={`/contests/${contest.contestId}`}
              className="block"
            >
              <div
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-around w-full mb-4">
                    <div className="flex flex-col items-center">
                      <img 
                        src={contest.localTeamPic} 
                        alt={contest.localTeamName} 
                        className="w-12 h-12 rounded-full object-cover mb-1" 
                      />
                      <span className="text-sm font-medium text-center">{contest.localTeamName}</span>
                    </div>
                    <span className="font-bold text-xl">VS</span>
                    <div className="flex flex-col items-center">
                      <img 
                        src={contest.visitorTeamPic} 
                        alt={contest.visitorTeamName} 
                        className="w-12 h-12 rounded-full object-cover mb-1" 
                      />
                      <span className="text-sm font-medium text-center">{contest.visitorTeamName}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg">Date: {contest.date ? new Date(contest.date).toLocaleString() : 'N/A'}</p>
                  <p className="text-gray-700 text-lg">Venue: {contest.venue ? contest.venue : 'N/A'}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No contests found.</p>
        )}
      </motion.div>
    </div>
  );
};

export default ContestList;