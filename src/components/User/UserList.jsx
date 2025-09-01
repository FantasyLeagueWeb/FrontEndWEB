// Frontend: UserList.js (adapted for users, add button only for admins)

import React, { useState, useEffect, useContext , useMemo } from 'react';
import userService from '../../services/userService'; // Assume this service handles API calls to UserController
import { Link } from 'react-router-dom';
import { FaPlus, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SearchBar from '../Shared/SearchBar';
import { AuthContext } from '../../contexts/AuthContext';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { user } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // const checkAdmin = () => {
    //   const role = authService.getUserRole(); // Assume method to get current user role
    //   setIsAdmin(role === 'Admin');
    // };
    // checkAdmin();

    const fetchUsers = async () => {
        debugger
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        setUsers(data || []);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const filtered = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    return (users || []).filter((u) => {
      if (!term) return true;
      return (
        u.username?.toLowerCase().includes(term) ||
        u.firstName?.toLowerCase().includes(term) ||
        u.lastName?.toLowerCase().includes(term) ||
        u.role?.toLowerCase().includes(term)
      );
    });
  }, [users, debouncedSearch]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const getStatusBadge = (active) => {
    const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium';
    return active ? <span className={`${base} bg-green-200 text-green-800`}>Active</span> : <span className={`${base} bg-red-200 text-red-800`}>Inactive</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <div className="w-full sm:w-auto">
            <h1 className="flex items-center text-lg sm:text-2xl font-extrabold text-gray-900 whitespace-nowrap overflow-hidden">
              <FaUser className="mr-3 text-indigo-600 text-lg sm:text-2xl" />
              <span className="truncate">Users</span>
            </h1>
          </div>
          <div className="w-full sm:w-auto flex items-center gap-3 mt-2 sm:mt-0">
            <div className="flex-1 sm:flex-none">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search by username, name or role" />
            </div>
            {user?.role?.toLowerCase() === 'admin' && (
              <Link
                to="/users/add"
                className="ml-auto inline-flex items-center justify-center bg-indigo-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-indigo-700 transform hover:scale-105 transition-transform duration-150 shadow-md text-sm"
              >
                <FaPlus className="mr-2 text-sm" />
                <span className="hidden sm:inline">Add User</span>
                <span className="sm:hidden">Add</span>
              </Link>
            )}
          </div>
        </header>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          {/* Mobile card list */}
          <div className="sm:hidden grid gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg p-4 shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-8 bg-gray-200 rounded w-full mt-2" />
                </div>
              ))
            ) : pageData.length > 0 ? (
              pageData.map((u) => (
                <Link to={`/users/${u.userId}`} key={u.userId} className="block bg-white rounded-lg p-4 shadow hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{u.username}</div>
                      <div className="text-xs text-gray-500 mt-1">{u.role}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div>{getStatusBadge(u.active)}</div>
                      <div className="text-xs text-indigo-600 font-medium">View</div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white rounded-lg p-6 text-center text-gray-600">No users found.</div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Active</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: perPage }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-28 animate-pulse" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-28 animate-pulse" /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right"><div className="h-8 bg-gray-200 rounded w-20 inline-block animate-pulse" /></td>
                    </tr>
                  ))
                ) : pageData.length > 0 ? (
                  pageData.map((user) => (
                    <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/users/${user.userId}`} className="text-indigo-600 hover:text-indigo-800 font-semibold">
                          {user.username}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{`${user.firstName || ''} ${user.lastName || ''}`.trim()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.active)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link to={`/users/${user.userId}`} className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100">View</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-600">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Showing</span>
              <strong>{total === 0 ? 0 : (page - 1) * perPage + 1}</strong>
              <span>to</span>
              <strong>{Math.min(page * perPage, total)}</strong>
              <span>of</span>
              <strong>{total}</strong>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Per page:</label>
              <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="border border-gray-200 rounded-md px-2 py-1 text-sm bg-white">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>

              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded-md border border-gray-200 bg-white disabled:opacity-50">Prev</button>
                <div className="px-3 py-1 text-sm">{page} / {totalPages}</div>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded-md border border-gray-200 bg-white disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}