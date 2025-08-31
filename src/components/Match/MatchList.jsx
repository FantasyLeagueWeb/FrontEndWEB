// Updated MatchList component
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import matchService from '../../services/matchService';
import leagueService from '../../services/leagueService';
import { Link } from 'react-router-dom';
import { FaPlus, FaFutbol } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SearchBar from '../Shared/SearchBar';
import { MdSportsCricket } from 'react-icons/md'

const MatchList = () => {
  const { leagueId } = useParams(); // Get leagueId from URL params if present
  const [matches, setMatches] = useState([]);
  const [league, setLeague] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let matchData;
        if (leagueId) {
          matchData = await matchService.getFixturesByLeague(leagueId); // Fetch upcoming fixtures for league
          const leagueData = await leagueService.getLeagueById(leagueId);
          setLeague(leagueData);
        } else {
          matchData = await matchService.getAllMatches(); // Fetch all matches if no leagueId
        }
        setMatches(matchData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [leagueId]);

  const filteredMatches = searchTerm.trim()
    ? matches.filter(match =>
        match?.name?.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    : matches;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Loading matches...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      {league && (
        <div className="flex justify-center mb-4">
          {league.imagePath ? (
            <img 
              src={league.imagePath} 
              alt={league.code.toUpperCase()} 
              className="w-20 h-20 rounded-full object-contain" 
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 text-3xl font-bold">
              {league.code ? league.code.toUpperCase() : league.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}
     <h2 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
  <div className="flex justify-center items-center mb-2">
    <MdSportsCricket className="mr-2 text-4xl" />
    <span>{league?.name}</span>
  </div>
  <div>Fixtures</div>
</h2>
      <div className="flex justify-between items-center mb-6">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {/* <Link to="/matches/add" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center transform hover:scale-105 transition-transform duration-200">
          <FaPlus className="mr-2" /> Add Match
        </Link> */}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <Link
              key={match.id || match.matchId}
              to={`/matches/${match.id || match.matchId}`}
              className="block"
            >
              <div
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {leagueId ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-around w-full mb-4">
                      <div className="flex flex-col items-center">
                        <img 
                          src={match.localTeamLogo} 
                          alt={match.localTeamName} 
                          className="w-12 h-12 rounded-full object-cover mb-1" 
                        />
                        <span className="text-sm font-medium text-center">{match.localTeamName}</span>
                      </div>
                      <span className="font-bold text-xl">VS</span>
                      <div className="flex flex-col items-center">
                        <img 
                          src={match.visitorTeamLogo} 
                          alt={match.visitorTeamName} 
                          className="w-12 h-12 rounded-full object-cover mb-1" 
                        />
                        <span className="text-sm font-medium text-center">{match.visitorTeamName}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg">Date: {new Date(match.date).toLocaleString()}</p>
                    {match.venue && <p className="text-gray-700 text-lg">Venue: {match.venue}</p>}
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center">
                      <FaFutbol className="mr-2" /> {match.name}
                    </div>
                    <p className="text-gray-700 mt-2 text-lg">Date: {match.date}</p>
                  </>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No matches found.</p>
        )}
      </motion.div>
    </div>
  );
};

export default MatchList;