import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import matchService from '../../services/matchService';
import { FaSave, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


const MatchForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState({ name: '', date: '' });

  useEffect(() => {
    if (id) {
      const fetchMatch = async () => {
        try {
          const data = await matchService.getMatchById(id);
          setMatch(data);
        } catch (error) {
          console.error('Failed to fetch match', error);
        }
      };
      fetchMatch();
    }
  }, [id]);

  const handleChange = (e) => {
    setMatch({ ...match, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await matchService.updateMatch(match);
      } else {
        await matchService.addMatch(match);
      }
      navigate('/matches');
    } catch (error) {
      console.error('Failed to save match', error);
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
        <h2 className="text-3xl font-bold mb-6 text-gray-900">{id ? 'Edit Match' : 'Add Match'}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Match Name"
              value={match.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={match.date}
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
              to="/matches"
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

export default MatchForm;