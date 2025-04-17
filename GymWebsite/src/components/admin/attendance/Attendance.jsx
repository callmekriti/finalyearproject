import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendancePage = () => {
  const [presentUsers, setPresentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStudentId, setNewStudentId] = useState('');
  const [newDate, setNewDate] = useState(''); // Consider using a date picker
  const [newStatus, setNewStatus] = useState('');

  // New state for search
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // To track if a search is active


  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get('http://localhost:8000/attendance/present_today/');
        console.log(response.data.data);
        //Access data from the api response
        setPresentUsers(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError(err.message || "Failed to fetch attendance.");
        setLoading(false);
      }
    };

    // Only fetch if not searching
    if (!isSearching) {
      fetchAttendance();
    }

  }, [isSearching]); //Re-run when isSearching changes


  const handleSearch = async () => {
    setIsSearching(true); // Indicate that a search is active
    try {
      const response = await axios.get(`http://localhost:8000/attendance/get_by_username/?username=${searchUsername}`);
      console.log(response.data.data);
      setSearchResults(response.data.data); // Assuming the API returns an array of attendance records
    } catch (err) {
      console.error("Error searching attendance:", err);
      setError(err.message || "Failed to search attendance.");
      setSearchResults([]); // Clear previous results in case of error
    }
  };

  const handleBack = () => {
    setIsSearching(false); // Set isSearching to false, triggering useEffect to refetch present users
    setSearchUsername('');  // Clear the search input
    setSearchResults([]); // Clear the search results
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading attendance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Attendance Today</h1>


      {/* Search Bar */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Search Attendance by User Name</h2>
        <div className="flex">
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            placeholder="Enter username"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
          />
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Search Results Display */}
      {isSearching && searchResults.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Search Results</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.time_in}</td>
                    {/* Add more data fields as needed */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleBack}
          >
            Back to All Attendance
          </button>
        </div>
      )}


      {/* Attendance List */}
      {!isSearching && presentUsers.length === 0 ? (
        <p>No attendance records found for today.</p>
      ) : (
        !isSearching && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                </tr>
              </thead>
              <tbody>
                {presentUsers.map((users, index) => (  //Use index. it is unlikely that a username will be repeated
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {users.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default AttendancePage;