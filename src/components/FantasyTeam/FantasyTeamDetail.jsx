import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import fantasyTeamService from '../../services/fantasyTeamService';
import { FaEdit, FaCrown, FaStar, FaSync, FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Enhanced UI for FantasyTeamDetail
// - Responsive layout with a collapsible right stats panel on small screens
// - Cleaner player cards with clear hierarchy and better spacing
// - Subcomponents for readability

const StatBadge = ({ label, value, className = '' }) => (
  <div className={`flex flex-col items-center p-3 rounded-2xl shadow-sm bg-white ${className}`}>
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-lg font-bold text-indigo-700">{value}</span>
  </div>
);

const PlayerCard = ({ player, isCaptain, isVC }) => (
  <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
    <img
      src={player.imagePath || 'https://via.placeholder.com/64?text=P'}
      alt={player.name}
      className="w-14 h-14 rounded-full object-cover mr-4 flex-shrink-0"
    />

    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <div className="truncate">
          <p className="font-semibold text-md truncate">{player.name}</p>
          <p className="text-xs text-gray-500 truncate">{player.role} • {player.team}</p>
        </div>
        <div className="flex items-center ml-3">
          {isCaptain && <FaCrown title="Captain" className="text-yellow-500 mr-2" />}
          {isVC && <FaStar title="Vice Captain" className="text-blue-500 mr-2" />}
        </div>
      </div>

      <div className="mt-2 flex items-end justify-between">
        <div className="text-xs text-gray-500">
          <div>Credits: <span className="font-medium text-gray-700">{player.credits}</span></div>
          <div className="mt-1">Base: <span className="font-medium text-gray-800">{player.points}</span> {player.multiplier > 1 && <span className="text-indigo-600">×{player.multiplier}</span>}</div>
        </div>

        <div className="text-right">
          <div className="text-sm font-semibold text-green-600">{Number(player.effectivePoints || 0).toFixed(1)}</div>
          <div className="text-xs text-gray-400">Eff. Points</div>
        </div>
      </div>
    </div>
  </div>
);

const FantasyTeamDetail = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const formatDate = (date) => date ? new Date(date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A';

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const data = await fantasyTeamService.getFantasyTeamById(id);
      if (data.players) {
        data.players = data.players.map(player => {
          let multiplier = 1;
          if (player.playerId === data.captainId) multiplier = 2;
          else if (player.playerId === data.viceCaptainId) multiplier = 1.5;
          const effectivePoints = Number((player.points * multiplier).toFixed(1));
          return { ...player, multiplier, effectivePoints };
        });
        // Sort by effectivePoints desc
        data.players.sort((a, b) => b.effectivePoints - a.effectivePoints);
      }
      setTeam(data);
    } catch (error) {
      console.error('Failed to fetch team', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
    // hide sidebar on small screens by default
    if (window.innerWidth < 1024) setShowSidebar(false);
  }, [id]);

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
          <p className="text-xl text-gray-600 animate-pulse">Loading team details...</p>
        </div>
      </div>
    );
  }

  const isLive = team.contestStatus === 'Live';
  const rankColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600', 'text-gray-600', 'text-gray-600'];
  const isUserInTop5 = team.top5Rankings?.some(r => r.fantasyTeamId === team.fantasyTeamId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Main card */}
        <div className="lg:col-span-8 col-span-1">
          <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
           

            {/* Match Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 mb-6">
              {/* Compact, mobile-first combined team image + titles */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-28 h-28 sm:w-44 sm:h-28 flex-shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
                    {/* overlapping logos: use transforms so they remain inside container on small screens */}
                    <img src={team.localTeamPic || 'https://via.placeholder.com/84?text=T1'} alt={team.localTeamName} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover absolute left-1 top-1 sm:left-4 sm:top-4 border-2 border-white shadow" />
                    <img src={team.visitorTeamPic || 'https://via.placeholder.com/84?text=T2'} alt={team.visitorTeamName} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover absolute right-1 bottom-1 sm:right-4 sm:bottom-4 border-2 border-white shadow" />

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-white/95 px-2 py-1 rounded-full text-sm font-semibold shadow">VS</div>
                    </div>
                  </div>
                </div>

              <div className="min-w-0">
  <div className="text-base sm:text-lg font-semibold text-gray-900">
    <span className="block sm:inline">{team.localTeamName}</span>
    <span className="block sm:inline text-gray-400"> vs </span>
    <span className="block sm:inline">{team.visitorTeamName}</span>
  </div>
</div>
              </div>

              {/* Controls: stack under the image on mobile, align right on larger screens */}
              <div className="flex items-center gap-2 mt-3 sm:mt-0">
                {/* {isLive && (
                )} */}
                  <button
                    onClick={fetchTeam}
                    disabled={loading}
                    className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-green-600 text-white shadow hover:bg-green-700 transform hover:scale-105 transition-all text-sm"
                    aria-label="Refresh live points"
                  >
                    <FaSync className={`${loading ? 'animate-spin' : ''} mr-2`} /> {loading ? 'Refreshing' : 'Refresh'}
                  </button>
                

                {/* <Link to={`/fantasy-teams/edit/${id}`} className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700 text-sm">
                  <FaEdit className="mr-2" /> Edit
                </Link> */}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="col-span-1">
                <div className="text-xs text-gray-500">Date</div>
                <div className="font-medium text-gray-800">{formatDate(team.date)}</div>
              </div>
              <div className="col-span-1">
                <div className="text-xs text-gray-500">Venue</div>
                <div className="font-medium text-gray-800">{team.venue || 'N/A'}</div>
              </div>
              <div className="col-span-1">
                <div className="text-xs text-gray-500">Status</div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${isLive ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}`}>{team.contestStatus || 'N/A'}</div>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Team Players Points</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {team.players && team.players.length > 0 ? (
                team.players.map(player => (
                  <PlayerCard
                    key={player.playerId}
                    player={player}
                    isCaptain={team.captainId === player.playerId}
                    isVC={team.viceCaptainId === player.playerId}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-6">No players in this team.</div>
              )}
            </div>

            {/* Footer quick summary */}
            <div className="mt-6 border-t pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">Your Rank</div>
                <div className="text-lg font-bold text-indigo-800">#{team.userRank || '-'}</div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">Total Points</div>
                <div className="text-xl font-extrabold text-indigo-600">{team.fantasyTeamPoints || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar: stats & leaderboard */}
        <aside className={`lg:col-span-4 col-span-1 ${showSidebar ? '' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-2xl shadow p-5 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FaTrophy className="text-yellow-500" />
                <h4 className="font-semibold">Leaderboard</h4>
              </div>
              <button onClick={() => setShowSidebar(s => !s)} className="text-xs text-gray-500 hidden lg:inline">Toggle</button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatBadge label="Total Points" value={team.fantasyTeamPoints || 0} />
              <StatBadge label="Your Rank" value={team.userRank || '-'} />
            </div>

            <div className="max-h-72 overflow-y-auto">
              {team.top5Rankings && team.top5Rankings.length > 0 ? (
                <ul className="space-y-2">
                  {team.top5Rankings.map((ranking, index) => (
                    <li key={ranking.fantasyTeamId} className={`flex items-center justify-between p-3 rounded-lg border ${ranking.fantasyTeamId === team.fantasyTeamId ? 'bg-indigo-50 font-semibold' : 'bg-white'}`}>
                      <div className="truncate">
                        <div className={`text-sm ${rankColors[index] || 'text-gray-700'}`}>#{ranking.rank} {ranking.userName || `Fantacy Team ID ${ranking.fantasyTeamId}`}</div>
                        <div className="text-xs text-gray-400 truncate">{ranking.userTag || ''}</div>
                      </div>
                      <div className="text-sm font-bold text-green-600">{ranking.points}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-sm">No rankings available yet.</div>
              )}
            </div>

            {!isUserInTop5 && team.userRank && (
              <div className="mt-4 border-t pt-3">
                <div className="text-xs text-gray-500">You</div>
                <div className="flex items-center justify-between mt-1">
                  <div className="font-medium text-indigo-700">#{team.userRank}</div>
                  <div className="font-bold">{team.fantasyTeamPoints || 0}</div>
                </div>
              </div>
            )}

          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default FantasyTeamDetail;
