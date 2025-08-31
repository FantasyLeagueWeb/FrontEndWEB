import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-10 min-h-screen flex flex-col items-center justify-center"
    >
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 flex items-center">
        <FaTrophy className="mr-2" /> Welcome to Ideal11
      </h1>
      <p className="text-xl text-gray-700 mb-8 text-center max-w-2xl">
        Create and manage your fantasy teams, join contests, and compete in leagues!
      </p>
      <Link
        to="/dashboard"
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 transform hover:scale-105"
      >
        Get Started
      </Link>
    </motion.div>
  );
};

export default Home;