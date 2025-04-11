import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MembershipPieChart from './MembershipPieChart';
import BarGraph from './BarGraph';

function Report() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/analytics/');
        console.log(response.data);
        setAnalyticsData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error("Error fetching analytics:", err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 bg-gray-100 min-h-screen">Loading analytics data...</div>;
  }

  if (error) {
    return <div className="p-8 bg-gray-100 min-h-screen">Error: {error.message}</div>;
  }

  if (!analyticsData) {
    return <div className="p-8 bg-gray-100 min-h-screen">No analytics data available.</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-200 rounded-lg ">
          <div>
            <h1 className="text-2xl font-bold text-center">Membership Distribution</h1>
          </div>
          <div className="flex items-center justify-center">
            <MembershipPieChart data={analyticsData} />
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg  ">
          <div>
            <h1 className="text-2xl font-bold text-center">Membership Over Time</h1>
          </div>
          <div className="flex items-center justify-center my-20">
            <BarGraph data={analyticsData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;``