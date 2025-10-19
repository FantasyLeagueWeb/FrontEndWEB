// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/Shared/Toast';
import Header from './components/Shared/Header';
import Footer from './components/Shared/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import LeagueList from './components/League/LeagueList';
import LeagueDetail from './components/League/LeagueDetail';
import LeagueForm from './components/League/LeagueForm';
import TeamList from './components/Team/TeamList';
import TeamDetail from './components/Team/TeamDetail';
import TeamForm from './components/Team/TeamForm';
import PlayerList from './components/Player/PlayerList';
import PlayerDetail from './components/Player/PlayerDetail';
import PlayerForm from './components/Player/PlayerForm';
import MatchList from './components/Match/MatchList';
import MatchDetail from './components/Match/MatchDetail';
import MatchForm from './components/Match/MatchForm';
import ContestList from './components/Contest/ContestList';
import ContestDetail from './components/Contest/ContestDetail';
import ContestForm from './components/Contest/ContestForm';
import ContestWinners from './components/Contest/ContestWinners';
import FantasyTeamList from './components/FantasyTeam/FantasyTeamList';
import FantasyTeamDetail from './components/FantasyTeam/FantasyTeamDetail';
import FantasyTeamForm from './components/FantasyTeam/FantasyTeamForm';
import PaymentList from './components/Payment/PaymentList';
import PaymentDetail from './components/Payment/PaymentDetail';
import PaymentForm from './components/Payment/PaymentForm';
import PaymentRequestList from './components/PaymentRequest/PaymentRequestList';
import PaymentRequestDetail from './components/PaymentRequest/PaymentRequestDetail';
import PaymentRequestForm from './components/PaymentRequest/PaymentRequestForm';
import WithdrawalManagement from './components/Withdrawal/WithdrawalManagement';
import WithdrawalHistory from './components/Withdrawal/WithdrawalHistory';
import UserList from './components/User/UserList';
import UserDetail from './components/User/UserDetail';
import UserForm from './components/User/UserForm';
import IdealQ from './components/Shared/ideal';


const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
        <Header />
        <main className="min-h-screen">
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leagues" element={<LeagueList />} />
              <Route path="/leagues/:id" element={<LeagueDetail />} />
              <Route path="/leagues/add" element={<LeagueForm />} />
              <Route path="/leagues/edit/:id" element={<LeagueForm />} />
              <Route path="/leagues/:leagueId/matches" element={<MatchList />} />
              <Route path="/teams" element={<TeamList />} />
              <Route path="/teams/:id" element={<TeamDetail />} />
              <Route path="/teams/add" element={<TeamForm />} />
              <Route path="/teams/edit/:id" element={<TeamForm />} />
              <Route path="/players" element={<PlayerList />} />
              <Route path="/players/:id" element={<PlayerDetail />} />
              <Route path="/players/add" element={<PlayerForm />} />
              <Route path="/players/edit/:id" element={<PlayerForm />} />
              <Route path="/matches" element={<MatchList />} />
              <Route path="/matches/:id" element={<MatchDetail />} />
              <Route path="/matches/add" element={<MatchForm />} />
              <Route path="/matches/edit/:id" element={<MatchForm />} />
              <Route path="/contests" element={<ContestList />} />
              <Route path="/contests/:id" element={<ContestDetail />} />
              <Route path="/contests/:contestId/winners" element={<ContestWinners />} />
              <Route path="/contests/add" element={<ContestForm />} />
              <Route path="/contests/edit/:id" element={<ContestForm />} />
              <Route path="/fantasy-teams" element={<FantasyTeamList />} />
              <Route path="/fantasy-teams/:id" element={<FantasyTeamDetail />} />
              <Route path="/fantasy-teams/add" element={<FantasyTeamForm />} />
              <Route path="/fantasy-teams/edit/:id" element={<FantasyTeamForm />} />
              <Route path="/fantasy-teams/create/:contestId" element={<FantasyTeamForm />} /> {/* New route */}
              <Route path="/payments" element={<PaymentList />} />
              <Route path="/payments/:id" element={<PaymentDetail />} /> 
              <Route path="/payments/add" element={<PaymentForm />} />
              <Route path="/payment-requests" element={<PaymentRequestList />} />
              <Route path="/payment-requests/:id" element={<PaymentRequestDetail />} />
              <Route path="/payment-requests/add" element={<PaymentRequestForm />} />
              <Route path="/withdrawals" element={<WithdrawalHistory />} />
              <Route path="/admin/withdrawals" element={<WithdrawalManagement />} />
              <Route path="/users" element={<UserList />} /> 
              <Route path="/users/:id" element={<UserDetail />} />
              <Route path="/users/add" element={<UserForm />} />
              <Route path="/users/edit/:id" element={<UserForm />} />
              <Route path="/runq" element={<IdealQ />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
    </ToastProvider>
  );
};

export default App;