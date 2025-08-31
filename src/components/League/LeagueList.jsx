// Modified LeagueList component
import React, { useState, useEffect } from 'react';
import leagueService from '../../services/leagueService';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SearchBar from '../Shared/SearchBar';

const LeagueList = () => {
  const [leagues, setLeagues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const data = await leagueService.getAllLeagues();
        setLeagues(data);
      } catch (error) {
        console.error('Failed to fetch leagues', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeagues();
  }, []);

  const filteredLeagues = leagues.filter(league =>
    league.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Loading leagues...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900 flex items-center justify-center">
        Leagues
      </h2>
      <div className="flex justify-between items-center mb-6">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {/* <Link to="/leagues/add" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center transform hover:scale-105 transition-transform duration-200">
          <FaPlus className="mr-2" /> Add League
        </Link> */}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredLeagues.length > 0 ? (
          filteredLeagues.map((league) => (
            <Link
              key={league.leagueId}
              to={`/leagues/${league.leagueId}/matches`}
              className="block"
            >
             <div
  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
  style={{ height: "210px" }}
>
                <div className="flex justify-center mb-4">
                  {league.imagePath ? (
                    <img 
                      src={league.imagePath} 
                      // alt={league.name} 
                      className="w-20 h-20 rounded-full object-contain" 
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 text-3xl font-bold">
                      {league.code ? league.code.toUpperCase() : league.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-semibold text-indigo-600 hover:text-indigo-800 transition-colors text-center line-clamp-2">
                  {league.name}
                </h3>
                <div className="mt-auto">
                  {league.startDate && <p className="text-gray-700 mt-2 text-lg text-center">Start Date: {league.startDate}</p>}
                  {league.endDate && <p className="text-gray-700 mt-1 text-lg text-center">End Date: {league.endDate}</p>}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No leagues found.</p>
        )}
      </motion.div>
    </div>
  );
};

export default LeagueList;