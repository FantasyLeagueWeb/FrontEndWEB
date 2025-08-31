import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaUsers, FaFutbol, FaMoneyBill } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-10 min-h-screen"
    >
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/contests"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center"
        >
          <FaTrophy className="text-indigo-600 text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Contests</h2>
            <p className="text-gray-700">Manage contests</p>
          </div>
        </Link>
        <Link
          to="/fantasy-teams"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center"
        >
          <FaUsers className="text-indigo-600 text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Fantasy Teams</h2>
            <p className="text-gray-700">Manage teams</p>
          </div>
        </Link>
        <Link
          to="/matches"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center"
        >
          <FaFutbol className="text-indigo-600 text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Matches</h2>
            <p className="text-gray-700">Manage matches</p>
          </div>
        </Link>
        <Link
          to="/payments"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center"
        >
          <FaMoneyBill className="text-indigo-600 text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Payments</h2>
            <p className="text-gray-700">Manage payments</p>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default Dashboard;