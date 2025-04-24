import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

const Attendance = () => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    const fetchAttendance = async () => {
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        setError("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`http://localhost:8000/attendance/user/${userId}`);
        setAttendanceHistory(response.data.data || []);
        
        // Calculate current streak
        calculateStreak(response.data.data || []);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError("Failed to load attendance data. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchAttendance();
  }, []);
  
  const calculateStreak = (attendanceData) => {
    if (!attendanceData || attendanceData.length === 0) {
      setCurrentStreak(0);
      return;
    }
    
    // Sort by date (newest first)
    const sortedAttendance = [...attendanceData].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if most recent attendance is today or yesterday
    const mostRecent = new Date(sortedAttendance[0].date);
    mostRecent.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today - mostRecent) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      setCurrentStreak(0);
      return;
    }
    
    // Calculate streak
    for (let i = 0; i < sortedAttendance.length - 1; i++) {
      const currentDate = new Date(sortedAttendance[i].date);
      const prevDate = new Date(sortedAttendance[i + 1].date);
      
      currentDate.setHours(0, 0, 0, 0);
      prevDate.setHours(0, 0, 0, 0);
      
      const diffTime = currentDate - prevDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    setCurrentStreak(streak);
  };

  if (loading) {
    return <div className="p-6 flex justify-center">Loading attendance data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance History</h1>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-blue-800">Current Streak</h2>
            <p className="text-sm text-blue-600">Keep it going!</p>
          </div>
          <div className="text-3xl font-bold text-blue-700">{currentStreak} days</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceHistory.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No attendance records found
                </td>
              </tr>
            ) : (
              attendanceHistory.map((record, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(record.date), "MMMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.time_in}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Present
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
