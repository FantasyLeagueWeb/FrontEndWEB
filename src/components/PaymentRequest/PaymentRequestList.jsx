import React, { useState, useEffect, useMemo } from 'react';
import paymentService from '../../services/paymentService';
import { Link } from 'react-router-dom';
import { FaMoneyBill, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SearchBar from '../Shared/SearchBar';

// Enhanced, responsive admin Payment Request list (mobile fixes)
export default function PaymentRequestList() {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const data = await paymentService.getAllPayments();
        setPayments(data || []);
      } catch (error) {
        console.error('Failed to fetch payment requests', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // debounce search so typing isn't janky on mobile
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const filteredPayments = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    return (payments || []).filter((payment) => {
      if (!payment) return false;
      if (statusFilter !== 'All' && payment.status !== statusFilter) return false;

      if (!term) return true;
      return (
        payment.userId?.toString().toLowerCase().includes(term) ||
        payment.userFullName?.toLowerCase().includes(term) ||
        payment.userEnteredAmount?.toString().toLowerCase().includes(term) ||
        payment.status?.toLowerCase().includes(term)
      );
    });
  }, [payments, debouncedSearch, statusFilter]);

  // pagination
  const total = filteredPayments.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageData = filteredPayments.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const currency = (val) => {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(val);
    } catch {
      return `$${val}`;
    }
  };

  const getStatusBadge = (status) => {
    const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium';
    if (status === 'Pending') return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
    if (status === 'Approved') return <span className={`${base} bg-green-100 text-green-800`}>Approved</span>;
    if (status === 'Rejected') return <span className={`${base} bg-red-100 text-red-800`}>Rejected</span>;
    return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
  };

  const initials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header: stacks on mobile */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FaMoneyBill className="text-indigo-600 text-2xl" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Payment Requests</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto border border-gray-200 rounded-md px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>

            {/* Make search full width on mobile */}
            <div className="w-full sm:w-64">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search by name, id, amount or status" />
            </div>
          </div>
        </header>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          {/* Mobile: stacked cards with responsive inner layout */}
          <div className="sm:hidden grid gap-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg p-4 shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-8 bg-gray-200 rounded w-full mt-2" />
                </div>
              ))
            ) : pageData.length > 0 ? (
              pageData.map((p) => (
                <Link
                  to={`/payment-requests/${p.userAmountRecahargeId}`}
                  key={p.userAmountRecahargeId}
                  className="block bg-white rounded-lg p-4 shadow hover:shadow-md transition w-full"
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-sm">
                      {p.userFullName ? initials(p.userFullName) : <FaUserCircle className="text-xl" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-gray-900 truncate">{p.userFullName || '—'}</div>
                        <div className="text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</div>
                      </div>

                      <div className="mt-1 flex items-center justify-between gap-3">
                        <div className="text-xs text-gray-500 truncate">ID: {p.userId}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold">{currency(p.userEnteredAmount)}</div>
                          <div className="text-xs">{getStatusBadge(p.status)}</div>
                        </div>
                      </div>

                      {/* Ensure long names wrap gracefully but are truncated where needed */}
                      <div className="mt-2 text-xs text-gray-500 truncate">{p.userEmail || ''}</div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white rounded-lg p-6 text-center text-gray-600">No payment requests found.</div>
            )}
          </div>

          {/* Desktop/Table view */}
          <div className="hidden sm:block bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: perPage }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-32 animate-pulse" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse" /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right"><div className="h-8 bg-gray-200 rounded w-20 inline-block animate-pulse" /></td>
                    </tr>
                  ))
                ) : pageData.length > 0 ? (
                  pageData.map((payment) => (
                    <tr key={payment.userAmountRecahargeId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap w-28">{payment.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-semibold">{payment.userFullName ? initials(payment.userFullName) : <FaUserCircle />}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.userFullName}</div>
                          <div className="text-xs text-gray-500">{payment.userEmail || ''}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/payment-requests/${payment.userAmountRecahargeId}`} className="text-indigo-600 hover:text-indigo-800 font-semibold">
                          {currency(payment.userEnteredAmount)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          to={`/payment-requests/${payment.userAmountRecahargeId}`}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-600">No payment requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Showing</span>
              <strong>{total === 0 ? 0 : (page - 1) * perPage + 1}</strong>
              <span>to</span>
              <strong>{Math.min(page * perPage, total)}</strong>
              <span>of</span>
              <strong>{total}</strong>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Per page:</label>
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  className="border border-gray-200 rounded-md px-2 py-1 text-sm bg-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-md border border-gray-200 bg-white disabled:opacity-50"
                >
                  Prev
                </button>
                <div className="px-3 py-1 text-sm">{page} / {totalPages}</div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded-md border border-gray-200 bg-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
