import React, { useState } from 'react';
import axios from 'axios';

const AttendanceForm = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear any previous messages
    setError('');

    try {
      // Send the username to the check-in endpoint
      const response = await axios.post('http://localhost:8000/attendance/', { username });  // Assuming /api/attendance/ is your endpoint

      if (response.status === 201) {
        setMessage(response.data.message); // Display the success message from the backend
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Error during check-in:', err);
      if (err.response) {
        setError(err.response.data.message || 'Check-in failed. Please check your username and try again.');
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="block text-gray-700 text-xl font-bold mb-4">Attendance Check-In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Check-In
            </button>
          </div>
          {message && <p className="text-green-500 text-sm mt-4">{message}</p>}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AttendanceForm;