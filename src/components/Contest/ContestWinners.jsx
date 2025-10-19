import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaTrophy, FaMedal, FaAward, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import contestWinnerService from '../../services/contestWinnerService';

const ContestWinners = () => {
  const { contestId } = useParams();
  const [winners, setWinners] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        console.log('ContestWinners: Fetching winners for contestId:', contestId);
        const data = await contestWinnerService.getContestWinners(contestId);
        console.log('ContestWinners: Received data:', data);
        setWinners(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch contest winners', error);
        console.error('Error details:', error.response?.data || error.message);
        setError('Failed to load contest winners. Please try again later.');
        setLoading(false);
      }
    };

    fetchWinners();
  }, [contestId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Loading contest winners...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  if (!winners) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">No winners found for this contest.</p>
      </div>
    );
  }

  const WinnerCard = ({ winner, rank, icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-r ${color} p-6 rounded-xl shadow-lg mb-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-4xl mr-4">{icon}</div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {rank} Place Winner{winner.length > 1 ? 's' : ''}
            </h3>
            <p className="text-white opacity-90">
              {winner.length} {winner.length === 1 ? 'participant' : 'participants'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white text-lg font-semibold">
            Rs {winner[0]?.prizeAmount?.toLocaleString() || '0'} each
          </p>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        {winner.map((w, index) => (
          <div key={index} className="bg-white bg-opacity-20 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">{w.userName || 'User ' + w.userId}</p>
                <p className="text-white text-sm opacity-80">{w.userPhoneNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">Rs {w.prizeAmount?.toLocaleString()}</p>
                {w.payoutScreenshotUrl && (
                  <p className="text-white text-xs opacity-80">Payment Processed</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-10 min-h-screen bg-gray-100"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link
            to={'/contests/' + contestId}
            className="mr-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <FaArrowLeft className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Contest Winners</h1>
            <p className="text-gray-600 text-lg">Congratulations to all winners!</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{winners.contestName}</h2>
            <p className="text-gray-600">Contest #{winners.contestId}</p>
          </div>

          <div className="space-y-6">
            {winners.firstPlaceWinners?.length > 0 && (
              <WinnerCard
                winner={winners.firstPlaceWinners}
                rank="1st"
                icon="🥇"
                color="from-yellow-400 to-yellow-600"
              />
            )}

            {winners.secondPlaceWinners?.length > 0 && (
              <WinnerCard
                winner={winners.secondPlaceWinners}
                rank="2nd"
                icon="🥈"
                color="from-gray-300 to-gray-500"
              />
            )}

            {winners.thirdPlaceWinners?.length > 0 && (
              <WinnerCard
                winner={winners.thirdPlaceWinners}
                rank="3rd"
                icon="🥉"
                color="from-orange-400 to-orange-600"
              />
            )}

            {winners.firstPlaceWinners?.length === 0 && 
             winners.secondPlaceWinners?.length === 0 && 
             winners.thirdPlaceWinners?.length === 0 && (
              <div className="text-center py-12">
                <FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Winners Yet</h3>
                <p className="text-gray-500">Winners will be announced after the contest ends.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContestWinners;
