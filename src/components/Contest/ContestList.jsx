// Updated ContestList component
import React, { useState, useEffect, useContext } from 'react';
import contestService from '../../services/contestService';
import { Link } from 'react-router-dom';
import { FaTrophy, FaPlus, FaTrash, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SearchBar from '../Shared/SearchBar';
import { AuthContext } from '../../contexts/AuthContext';

const ContestList = () => {
  const [contests, setContests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contestToDelete, setContestToDelete] = useState(null);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'Admin';

  const fetchContests = async (start = startDate, end = endDate) => {
    try {
      setLoading(true);
      const params = {};
      if (start) params.startDate = start;
      if (end) params.endDate = end;
      const data = await contestService.getAllContests(params);
      setContests(data);
    } catch (error) {
      console.error('Failed to fetch contests', error);
    } finally {
      setLoading(false);
    }
  };

  // Set default date range: 1 week before to 1 week after current date
  useEffect(() => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(today.getDate() + 7);
    
    const startDateStr = oneWeekAgo.toISOString().split('T')[0];
    const endDateStr = oneWeekLater.toISOString().split('T')[0];
    
    setStartDate(startDateStr);
    setEndDate(endDateStr);
    
    // Load contests with default date range on initial mount
    fetchContests(startDateStr, endDateStr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    if (startDate && endDate) {
      fetchContests(startDate, endDate);
    } else {
      alert('Please select both start and end dates');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredContests = searchTerm.trim()
    ? contests.filter(contest =>
        contest.localTeamName?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        contest.visitorTeamName?.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    : contests;

  const handleDeleteClick = (contestId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setContestToDelete(contestId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contestToDelete) return;
    
    try {
      await contestService.deleteContest(contestToDelete);
      // Refresh the list with current date filters
      fetchContests(startDate, endDate);
      setShowDeleteConfirm(false);
      setContestToDelete(null);
    } catch (error) {
      console.error('Failed to delete contest', error);
      alert('Failed to delete contest');
      setShowDeleteConfirm(false);
      setContestToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setContestToDelete(null);
  };

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
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium whitespace-nowrap">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium whitespace-nowrap">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2 font-medium whitespace-nowrap"
          >
            <FaSearch />
            Search
          </button>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredContests.length > 0 ? (
          filteredContests.map((contest) => (
            <div key={contest.contestId} className="relative">
              <Link
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
              {isAdmin && (
                <button
                  onClick={(e) => handleDeleteClick(contest.contestId, e)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg z-10"
                  title="Delete Contest"
                >
                  <FaTrash size={16} />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No contests found.</p>
        )}
      </motion.div>

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
    </div>
  );
};

export default ContestList;