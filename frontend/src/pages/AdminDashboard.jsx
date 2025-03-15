import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCode, setNewCode] = useState('');
  const [editId, setEditId] = useState(null);
  const [editCode, setEditCode] = useState('');
  const [message, setMessage] = useState('');
  const [claims, setClaims] = useState([]);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/coupons', {
        withCredentials: true,
      });
      setCoupons(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load coupons');
    }
  };

  const fetchClaims = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/claims', {
        withCredentials: true,
      });
      setClaims(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchClaims();
  }, []);

  const handleAddCoupon = async () => {
    if (!newCode) return;
    try {
      await axios.post(
        'http://localhost:5000/api/admin/coupons',
        { code: newCode },
        { withCredentials: true }
      );
      setNewCode('');
      fetchCoupons();
      setMessage('Coupon added');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Add failed');
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/coupons/${id}`,
        { code: editCode },
        { withCredentials: true }
      );
      setEditId(null);
      setEditCode('');
      fetchCoupons();
      setMessage('Coupon updated');
    } catch (err) {
      console.error(err);
      setMessage('Update failed');
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/coupons/${id}/toggle`,
        {},
        { withCredentials: true }
      );
      fetchCoupons();
    } catch (err) {
      console.error(err);
      setMessage('Toggle failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <h2 className="text-3xl font-bold text-indigo-400 mb-8">📋 Admin Dashboard</h2>

      {/* Add Coupon */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <input
          type="text"
          placeholder="New coupon code"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none"
        />
        <button
          onClick={handleAddCoupon}
          className="glitter-button px-4 py-2 bg-gradient-to-r from-green-600 to-lime-500 hover:from-green-700 hover:to-lime-600 duration-300 text-white rounded font-semibold cursor-pointer"
        >
          Add Coupon
        </button>
      </div>

      {message && <p className="text-green-400 mb-4">{message}</p>}

      {/* Coupon Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 text-sm">
          <thead className="bg-gray-800 text-indigo-300">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Claimed</th>
              <th className="p-3">Active</th>
              <th className="p-3">Claimed By</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-t border-gray-700 text-center">
                <td className="p-2">
                  {editId === c._id ? (
                    <input
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      className="px-2 py-1 bg-gray-700 rounded"
                    />
                  ) : (
                    c.code
                  )}
                </td>
                <td>{c.isClaimed ? 'Yes' : 'No'}</td>
                <td>{c.isActive ? 'Yes' : 'No'}</td>
                <td>
                  {c.claimedBy?.ip
                    ? `${c.claimedBy.ip} (${new Date(c.claimedBy.time).toLocaleString()})`
                    : '—'}
                </td>
                <td className="flex justify-center gap-2 p-2">
                  {editId === c._id ? (
                    <button
                      onClick={() => handleUpdate(c._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(c._id);
                          setEditCode(c.code);
                        }}
                        className="px-3 py-1 bg-yellow-600 text-white rounded cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggle(c._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer"
                      >
                        Toggle
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Claim History */}
      <h3 className="text-xl font-semibold text-indigo-300 mt-12 mb-4">📜 Claim History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 text-sm">
          <thead className="bg-gray-800 text-indigo-300">
            <tr>
              <th className="p-3">Coupon Code</th>
              <th className="p-3">IP</th>
              <th className="p-3">Session ID</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {claims.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">
                  No claims yet
                </td>
              </tr>
            ) : (
              claims.map((c, i) => (
                <tr key={i} className="border-t border-gray-700 text-center">
                  <td className="p-2 font-semibold">{c.couponCode}</td>
                  <td className="p-2 font-semibold">{c.ip}</td>
                  <td className="p-2 font-semibold">{c.sessionId}</td>
                  <td className="p-2 font-semibold">{new Date(c.claimedAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
