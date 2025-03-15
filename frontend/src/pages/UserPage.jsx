import React, { useState } from 'react';
import axios from 'axios';

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
  return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
}

const UserPage = () => {
  const [message, setMessage] = useState('');
  const [coupon, setCoupon] = useState(null);

  const handleClaim = async () => {
    try {
      let sessionId = getCookie('session_id');

      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2);
        setCookie('session_id', sessionId, 7);
      }

      const res = await axios.post(
        '/api/coupons/claim',
        {},
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      setCoupon(res.data.coupon);
      setMessage(res.data.message);
    } catch (err) {
      setCoupon(null);
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
  <div className="bg-gray-800 shadow-lg rounded-xl p-8 max-w-md w-full text-center">
    <h1 className="text-2xl font-bold mb-4 text-indigo-400">🎁 Claim Your Coupon</h1>
    <button
      className="glitter-button bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-md transition cursor-pointer"
      onClick={handleClaim}
    >
      Claim Coupon
    </button>
    
    {coupon && (
      <div className="mt-4 bg-green-700/20 text-green-400 font-semibold py-2 px-4 rounded shadow-inner">
        🎉 Your Coupon: {coupon}
      </div>
    )}
  </div>
  {message && (
      <p className="mt-4 text-gray-300 text-xl">{message}</p>
    )}
</div>

  );
};

export default UserPage;
