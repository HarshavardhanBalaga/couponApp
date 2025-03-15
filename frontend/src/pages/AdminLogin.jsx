import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await axios.post(
        '/api/coupons/claim',
        { username, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.message === 'Login successful') {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-sm">
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-400">🔐 Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="glitter-button w-full py-2 rounded bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700"
        >
          Login
        </button>
      </form>
      {errorMsg && <p className="text-red-400 mt-4 text-center">{errorMsg}</p>}
    </div>
  </div>
  
  );
};

export default AdminLogin;
