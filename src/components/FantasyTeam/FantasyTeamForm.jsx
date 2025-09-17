import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import fantasyTeamService from '../../services/fantasyTeamService';
import { FaSave, FaTimes, FaCrown, FaStar, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ROLE_LIMITS = {
  Wicketkeeper: { min: 1, max: 8 },
  Batsman: { min: 1, max: 8 },
  Allrounder: { min: 1, max: 8 },
  Bowler: { min: 1, max: 8 },
};
const MAX_PLAYERS = 11;
const MAX_CREDITS = 100;

export default function FantasyTeamForm() {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [contest, setContest] = useState(location.state?.contest || null);
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [activeTab, setActiveTab] = useState('Wicketkeeper');
  const [error, setError] = useState(null);

  const formatDate = (date) => new Date(date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  useEffect(() => {
    if (contest) {
      const players = [
        ...(contest.localTeam?.players || []).map(p => ({
          ...p,
          team: contest.localTeam?.name || 'Local',
          playerId: p.playerId || p.apiPlayerId,
        })),
        ...(contest.visitorTeam?.players || []).map(p => ({
          ...p,
          team: contest.visitorTeam?.name || 'Visitor',
          playerId: p.playerId || p.apiPlayerId,
        })),
      ];
      if (players.length === 0) setError('No players available for this contest.');
      else setAllPlayers(players);
    } else {
      setError('Contest data not available. Please return to the contest details page.');
    }
  }, [contest]);

  const normalizeRole = (role) => {
    debugger
        console.log("",role)
    if (!role) return role;
    const r = role.toLowerCase();
    if (r.includes('allround')) return 'Allrounder';
    if (r.includes('wicket')) return 'Wicketkeeper';
  if (r.includes('batter') || (r.includes('bat') && !r.includes('allround'))) return 'Batsman';
    if (r.includes('bowl') && !r.includes('allround')) return 'Bowler';
    // fallback: capitalize first letter
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getPlayersByRole = (role) => {
    debugger
    if (!role) return [];
    if (role === 'Allrounder') {
      return allPlayers.filter(p => {
        const pr = (p.role || '').toLowerCase();
        return pr.includes('allround') || pr.includes('bowling allrounder') || pr.includes('batting allrounder');
      });
    }

     if (role === 'Batsman') {
      return allPlayers.filter(p => {
        const pr = (p.role || '').toLowerCase();
        return pr.includes('batsman') || pr.includes('batter') ;
      });
    }
    
    return allPlayers.filter(p => (p.role || '').toLowerCase().includes(role.toLowerCase()));
  };

  const isSelected = (playerId) => selectedPlayers.some(p => p.playerId === playerId);

  const getRoleCounts = (list = selectedPlayers) => list.reduce((acc, p) => {
    const r = normalizeRole(p.role);
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {});

  const getTotalCredits = (list = selectedPlayers) => list.reduce((sum, p) => sum + (p.credits || 0), 0);

  const toggleSelect = (player) => {
    debugger
    if (isSelected(player.playerId)) {
      // remove
      setSelectedPlayers(prev => {
        const next = prev.filter(p => p.playerId !== player.playerId);
        // clear captain/vice if removed
        if (captain === player.playerId) setCaptain(null);
        if (viceCaptain === player.playerId) setViceCaptain(null);
        return next;
      });
      return;
    }

    // add
    if (selectedPlayers.length >= MAX_PLAYERS) return alert(`Maximum ${MAX_PLAYERS} players allowed.`);
    const r = normalizeRole(player.role);
    if (!ROLE_LIMITS[r]) return alert(`Unknown role: ${player.role}`);
    const roleCounts = getRoleCounts();
    if ((roleCounts[r] || 0) >= ROLE_LIMITS[r].max) return alert(`Maximum ${ROLE_LIMITS[r].max} ${r}s allowed.`);
    if (getTotalCredits() + (player.credits || 0) > MAX_CREDITS) return alert('Credits limit exceeded.');

    setSelectedPlayers(prev => [...prev, player]);
  };

  const removePlayer = (playerId) => {
    setSelectedPlayers(prev => {
      const next = prev.filter(p => p.playerId !== playerId);
      if (captain === playerId) setCaptain(null);
      if (viceCaptain === playerId) setViceCaptain(null);
      return next;
    });
  };

  const selectCaptain = (playerId) => {
    if (viceCaptain === playerId) return alert('Cannot select same player as Vice-Captain.');
    setCaptain(playerId);
  };
  const selectViceCaptain = (playerId) => {
    if (captain === playerId) return alert('Cannot select same player as Captain.');
    setViceCaptain(playerId);
  };

  const getRemaining = (role) => {
    const count = getRoleCounts()[role] || 0;
    return { selected: count, left: ROLE_LIMITS[role].max - count };
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const roleCounts = getRoleCounts();
    if (selectedPlayers.length !== MAX_PLAYERS) return alert(`Select exactly ${MAX_PLAYERS} players.`);
    if (Object.keys(ROLE_LIMITS).some(role => (roleCounts[role] || 0) < ROLE_LIMITS[role].min)) return alert('Minimum role requirements not met.');
    if (!captain || !viceCaptain) return alert('Select Captain and Vice-Captain.');

    const dto = {
      ContestId: parseInt(contestId, 10),
      CaptainId: captain,
      ViceCaptainId: viceCaptain,
      PlayerIds: selectedPlayers.map(p => p.playerId),
    };

   try {
      await fantasyTeamService.addFantasyTeam(dto);
      navigate('/fantasy-teams');
    } catch (err) {
      console.error('Failed to save team', err);
      alert('Failed to create fantasy team.');
    }
  };

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow text-center max-w-lg">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/contests" className="inline-block bg-indigo-600 text-white px-5 py-2 rounded">Back to contests</Link>
      </div>
    </div>
  );

  /* UI subcomponents */
  const StatBadge = ({ label, value, icon }) => (
    <div className="flex items-center gap-3 bg-white border rounded-lg px-3 py-2 shadow-sm">
      <div className="text-indigo-600 text-lg">{icon}</div>
      <div className="flex flex-col">
        <div className="text-sm text-gray-500">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );

  const ProgressBar = ({ value, max }) => {
    const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" style={{ width: `${pct}%` }} />
      </div>
    );
  };

  const TeamCombined = ({ leftImg, rightImg }) => (
    <div className="flex items-center gap-3">
      <div className="relative w-20 h-12">
        <img src={leftImg || 'https://via.placeholder.com/72?text=T1'} alt="team-left" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover absolute left-0 top-0 border-2 border-white shadow-sm" />
        <img src={rightImg || 'https://via.placeholder.com/72?text=T2'} alt="team-right" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover absolute right-0 top-0 border-2 border-white shadow-sm" />
        <div className="absolute inset-0 rounded-md" aria-hidden />
      </div>
    </div>
  );

  const PlayerCard = ({ player }) => {
    const selected = isSelected(player.playerId);
    return (
      <button
        onClick={() => toggleSelect(player)}
        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-shadow text-left ${selected ? 'bg-green-50 border-green-300 shadow' : 'bg-white hover:shadow-md'}`}
        aria-pressed={selected}
        type="button"
      >
        <img src={player.imagePath || 'https://via.placeholder.com/64?text=P'} alt={player.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="truncate font-semibold text-gray-900 text-sm">{player.name}</h4>
            <div className="text-sm font-medium">{player.credits || 0} Cr</div>
          </div>
          <p className="text-xs text-gray-500 truncate">{player.team} • {player.role}</p>
        </div>
        <div className="flex-shrink-0">
          <input type="checkbox" checked={selected} readOnly aria-label={`Select ${player.name}`} />
        </div>
      </button>
    );
  };

  // Selected player row: full-width so it won't overlap inside vertical container
  const SelectedPlayerRow = ({ player, showCredits = true, showTeam = true }) => (
    <div className="w-full flex items-center gap-3 p-2 bg-gray-50 rounded-lg border min-w-0 overflow-hidden">
      <img src={player.imagePath || 'https://via.placeholder.com/48?text=P'} alt={player.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm leading-tight text-gray-900 truncate whitespace-nowrap">{player.name}</p>
        <p className="text-xs text-gray-500 truncate whitespace-nowrap">{player.role}{showTeam ? ` • ${player.team}` : ''}</p>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {showCredits && <div className="text-sm font-semibold">{player.credits || 0} Cr</div>}
        <div className="flex items-center gap-2">
          <button onClick={() => selectCaptain(player.playerId)} aria-label={`Make ${player.name} Captain`} className={`w-8 h-8 flex items-center justify-center rounded-full ${captain === player.playerId ? 'bg-yellow-500 text-white' : 'bg-gray-200'} hover:bg-yellow-400`} title="Captain"><FaCrown size={14} /></button>
          <button onClick={() => selectViceCaptain(player.playerId)} aria-label={`Make ${player.name} Vice-Captain`} className={`w-8 h-8 flex items-center justify-center rounded-full ${viceCaptain === player.playerId ? 'bg-blue-500 text-white' : 'bg-gray-200'} hover:bg-blue-400`} title="Vice-Captain"><FaStar size={14} /></button>
          <button onClick={() => removePlayer(player.playerId)} aria-label={`Remove ${player.name}`} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"><FaTimes size={14} /></button>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          <div className="p-4 md:p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <TeamCombined leftImg={contest?.localTeam?.apiTeamImage} rightImg={contest?.visitorTeam?.apiTeamImage} />
                <div className="flex flex-col">
                  <div className="text-sm font-semibold text-gray-800">{contest?.localTeam?.name} <span className="text-gray-400">vs</span> {contest?.visitorTeam?.name}</div>
                  <div className="text-xs text-gray-400 mt-1 md:mt-2">{contest?.date ? formatDate(contest.date) : 'N/A'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-between md:justify-end w-full md:w-auto">
                <div className="hidden md:flex items-center gap-3">
                  <StatBadge label="Players" value={`${selectedPlayers.length}/${MAX_PLAYERS}`} icon={<FaUsers />} />
                  <StatBadge label="Credits" value={`${getTotalCredits()}/${MAX_CREDITS}`} icon={<span className="text-xs">Cr</span>} />
                </div>

                <div className="ml-auto md:ml-0">
                  <Link to={`/contests/${contestId}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm"> <FaUsers /> <span className="hidden sm:inline">Contest Details</span></Link>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

              <div className="lg:col-span-3">
                <div className="mb-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {Object.keys(ROLE_LIMITS).map(role => (
                      <button key={role} type="button" onClick={() => setActiveTab(role)} className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === role ? 'bg-indigo-600 text-white' : 'bg-white border'} shadow-sm`}>
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {Object.keys(ROLE_LIMITS).map(r => {
                    const { selected, left } = getRemaining(r);
                    return (
                      <div key={r} className="bg-white p-3 rounded-lg border flex flex-col">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">{r}</div>
                          <div className="text-sm font-semibold">{selected}/{ROLE_LIMITS[r].max}</div>
                        </div>
                        <div className="mt-2 w-full"><ProgressBar value={selected} max={ROLE_LIMITS[r].max} /></div>
                        <div className="text-xs text-gray-400 mt-2">Left: {left}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {getPlayersByRole(activeTab).length ? (
                    getPlayersByRole(activeTab).map(p => <PlayerCard key={p.playerId} player={p} />)
                  ) : (
                    <div className="col-span-full text-center text-gray-500 p-6">No {activeTab} players available.</div>
                  )}
                </div>

                <div className="mt-4 md:hidden">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold">Selected ({selectedPlayers.length})</div>
                    <div className="text-sm text-gray-500">{getTotalCredits()}/{MAX_CREDITS} Cr</div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedPlayers.length ? selectedPlayers.map(p => (
                      <div key={p.playerId} className="flex-shrink-0 w-48">
                        <SelectedPlayerRow player={p} showCredits={false} showTeam={false} />
                      </div>
                    )) : <div className="text-gray-500">No players selected yet.</div>}
                  </div>
                </div>

              </div>

              <aside className="lg:col-span-1 hidden md:block">
                <div className="sticky top-6 space-y-4">
                  <div className="bg-yellow-50 p-3 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">Captain (2x)</div>
                        <div className="font-semibold text-sm">{captain ? selectedPlayers.find(p => p.playerId === captain)?.name : 'Not Selected'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Vice (1.5x)</div>
                        <div className="font-semibold text-sm">{viceCaptain ? selectedPlayers.find(p => p.playerId === viceCaptain)?.name : 'Not Selected'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border">
                    <h4 className="font-semibold mb-3">Selected Players</h4>
                    <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-2 w-full">
                      {selectedPlayers.length ? selectedPlayers.map(p => (
                        <div key={p.playerId} className="w-full">
                          <SelectedPlayerRow player={p} />
                        </div>
                      )) : (
                        <div className="text-gray-500">No players selected yet.</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border">
                    <div className="text-sm text-gray-500">Credits Used</div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1"><ProgressBar value={getTotalCredits()} max={MAX_CREDITS} /></div>
                      <div className="w-16 text-right font-semibold">{getTotalCredits()}/{MAX_CREDITS}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"> <FaSave /> Save Team</button>
                    <Link to={`/contests/${contestId}`} className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-gray-100 hover:bg-gray-200"> <FaTimes /> Cancel</Link>
                  </div>

                </div>
              </aside>

            </div>

            <div className=" md:hidden bg-white border-t p-3 safe-area-inset-bottom">
              <div className="max-w-6xl mx-auto flex gap-3">
                <button type="button" onClick={handleSubmit} className="flex-1 py-3 rounded-full bg-indigo-600 text-white flex items-center justify-center gap-2"> <FaSave /> Save</button>
                <Link to={`/contests/${contestId}`} className="py-3 px-4 rounded-full bg-gray-100 flex items-center justify-center gap-2"> <FaTimes /> Cancel</Link>
              </div>
            </div>

          </form>
        </div>
      </div>
    </motion.div>
  );
}
