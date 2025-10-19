import React, { useState, useEffect } from 'react';
import { FaTrophy, FaGift, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import contestWinnerService from '../../services/contestWinnerService';
import withdrawalService from '../../services/withdrawalService';

const WinnerNotification = ({ contestId, fantasyTeamId, onWithdrawClick }) => {
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchWinnerInfo = async () => {
      try {
        console.log('WinnerNotification: Fetching winner info for contestId:', contestId, 'fantasyTeamId:', fantasyTeamId);
        
        // Check if user is a winner
        const isWinner = await contestWinnerService.isUserWinner(contestId);
        console.log('WinnerNotification: Is user winner?', isWinner);
        
        if (isWinner) {
          // Get user winnings for this contest
          const winnings = await contestWinnerService.getUserWinnings();
          console.log('WinnerNotification: User winnings:', winnings);
          
          const contestWinning = winnings.find(w => 
            w.contestId === parseInt(contestId) && 
            w.fantasyTeamId === parseInt(fantasyTeamId)
          );
          
          console.log('WinnerNotification: Found contest winning:', contestWinning);
          
          if (contestWinning) {
            setWinnerInfo(contestWinning);
          }

          // Check if user can withdraw for this specific fantasy team
          const canWithdrawResult = await withdrawalService.canUserWithdraw(contestId, fantasyTeamId);
          console.log('WinnerNotification: Can user withdraw?', canWithdrawResult);
          setCanWithdraw(canWithdrawResult);
        }
      } catch (error) {
        console.error('Failed to fetch winner info:', error);
        console.error('Error details:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWinnerInfo();
  }, [contestId, fantasyTeamId]);

  console.log('WinnerNotification: Render state - loading:', loading, 'winnerInfo:', winnerInfo, 'dismissed:', dismissed, 'canWithdraw:', canWithdraw);

  if (loading || !winnerInfo || dismissed) {
    return null;
  }

  const getRankText = (rank) => {
    switch (rank) {
      case 1: return '1st Place';
      case 2: return '2nd Place';
      case 3: return '3rd Place';
      default: return rank + 'th Place';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏆';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-4xl mr-4">{getRankIcon(winnerInfo.rank)}</div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                Congratulations! 🎉
              </h3>
              <p className="text-white text-lg">
                You won <strong>{getRankText(winnerInfo.rank)}</strong> with a prize of{' '}
                <strong>Rs {winnerInfo.prizeAmount?.toLocaleString()}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {canWithdraw && (
          <div className="mt-4 pt-4 border-t border-white border-opacity-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaGift className="text-white mr-2" />
                <span className="text-white font-medium">
                  Ready to withdraw your winnings?
                </span>
              </div>
              <button
                onClick={onWithdrawClick}
                className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105"
              >
                Apply Withdraw
              </button>
            </div>
          </div>
        )}

        {!canWithdraw && (
          <div className="mt-4 pt-4 border-t border-white border-opacity-30">
            <div className="flex items-center">
              <FaTrophy className="text-white mr-2" />
              <span className="text-white text-sm">
                Withdrawal request already submitted for this contest
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WinnerNotification;
