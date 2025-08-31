import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../for-web-logo.png';
import paymentService from '../../services/paymentService'; // Adjust the import path as needed

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user]);

  const fetchBalance = async () => {
    try {
      const data = await paymentService.getBalance();
      setBalance(data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItem = ({ to, label, mobile = false }) => (
    <Link
      to={to}
      onClick={() => {
        if (mobile) setIsMenuOpen(false);
      }}
      className={`block ${
        mobile ? 'py-2' : 'hover:underline'
      } transition duration-300 text-gray-800 hover:text-blue-600`}
    >
      {label}
    </Link>
  );

  return (
    <header className="bg-white shadow-md">
      <nav className="flex justify-between items-center max-w-6xl mx-auto p-4">
        <Link to="/" className="transition duration-300 hover:scale-105">
          <img src={logo} alt="Ideal11 Logo" className="h-12 w-auto" />
        </Link>

        <div className="flex items-center space-x-4">
          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-4 font-medium">
            {user ? (
              user.role === 'admin' ? (
                <>
                  <NavItem to="/leagues" label="Leagues" />
                  {/* <NavItem to="/teams" label="Teams" /> */}
                  {/* <NavItem to="/players" label="Players" /> */}
                  {/* <NavItem to="/matches" label="Matches" /> */}
                  <NavItem to="/contests" label="Contests" />
                  {/* <NavItem to="/payments" label="Payments" /> */}
                  <NavItem to="/payment-requests" label="Payment Requests" />
                </>
              ) : (
                <>
                  {/* <NavItem to="/matches" label="Matches" /> */}
                  <NavItem to="/contests" label="Contests" />
                  <NavItem to="/fantasy-teams" label="Fantasy Teams" />
                  <NavItem to="/payments" label="Payments" />
                </>
              )
            ) : (
              <>
                <NavItem to="/login" label="Login" />
                <NavItem to="/register" label="Register" />
              </>
            )}
          </div>

          {/* Balance Display */}
          {user && (
            <div className="hidden md:flex items-center space-x-1 text-gray-800 font-medium">
              <span className="text-yellow-500">🪙</span>
              <span>{balance.toFixed(2)}</span>
            </div>
          )}

          {/* User Avatar & Dropdown */}
          {user && (
            <div className="relative">
              <button
                className="flex items-center space-x-2 transition duration-300 hover:scale-105"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="User Menu"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {user.username[0].toUpperCase()}
                </div>
                <span className="hidden md:inline text-gray-800">{user.username}</span>
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 animate-fade-in-down">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hamburger */}
          <button
            className="md:hidden focus:outline-none text-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16m-7 6h7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 animate-slide-down">
          {user && (
            <div className="flex items-center space-x-1 text-gray-800 font-medium py-2">
              <span className="text-yellow-500">🪙</span>
              <span>{balance.toFixed(2)}</span>
            </div>
          )}
          {user ? (
            user.role === 'admin' ? (
              <>
                <NavItem to="/leagues" label="Leagues" mobile />
                {/* <NavItem to="/teams" label="Teams" mobile /> */}
                {/* <NavItem to="/players" label="Players" mobile /> */}
                {/* <NavItem to="/matches" label="Matches" mobile /> */}
                <NavItem to="/contests" label="Contests" mobile />
                {/* <NavItem to="/payments" label="Payments" mobile /> */}
                <NavItem to="/payment-requests" label="Payment Requests" mobile />
              </>
            ) : (
              <>
                {/* <NavItem to="/matches" label="Matches" mobile /> */}
                <NavItem to="/contests" label="Contests" mobile />
                <NavItem to="/fantasy-teams" label="Fantasy Teams" mobile />
                <NavItem to="/payments" label="Payments" mobile />
              </>
            )
          ) : (
            <>
              <NavItem to="/login" label="Login" mobile />
              <NavItem to="/register" label="Register" mobile />
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;