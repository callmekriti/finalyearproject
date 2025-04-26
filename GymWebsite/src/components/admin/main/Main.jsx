import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../../context/GlobalContext";
import { FaMoneyBillWave, FaUsers, FaChartLine } from "react-icons/fa";
import { FiCalendar, FiDollarSign } from "react-icons/fi";
import SmallCalendar from "../calendar/SmallCalendar";
import DueTable from "./DueTable";
import StatCard from "./StatCard";
import BarGraph from "../report/BarGraph";
import axios from "axios";

function Main() {
  const { getTotalMembers, totalSalary, totalMembershipPrice } = useContext(GlobalContext);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/analytics/');
        setAnalyticsData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load analytics data");
        setLoading(false);
        console.error("Error fetching analytics:", err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen">
      {/* Main Content Area */}
      <div className="w-full lg:w-3/4 p-4 lg:p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <StatCard
            icon={<FaMoneyBillWave className="text-blue-600" />}
            title="Total Revenue"
            value={`$${analyticsData?.total_income?.toLocaleString() || '0'}`}
            trend="up"
            trendValue="12%"
          />
          <StatCard
            icon={<FaUsers className="text-green-600" />}
            title="Active Members"
            value={analyticsData?.member_count?.toLocaleString() || '0'}
            trend="up"
            trendValue="5%"
          />
          <StatCard
            icon={<FiDollarSign className="text-red-600" />}
            title="Total Expenses"
            value={`$${analyticsData?.total_expenses?.toLocaleString() || '0'}`}
            trend="down"
            trendValue="3%"
          />
        </div>
        
        {/* Due Payments Table */}
        <div className="mb-6">
          <DueTable />
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 p-4 lg:p-6 space-y-6">
        {/* Calendar */}
        <div className="bg-white rounded-lg shadow ">
          <div className="flex items-center mb-4">
            <FiCalendar className="text-gray-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Calendar</h3>
          </div>
          <SmallCalendar />
        </div>
        
        {/* Analytics Graph */}
        <div className="bg-white rounded-lg shadow ">
          <div className="flex items-center mb-4">
            <FaChartLine className="text-gray-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Performance</h3>
          </div>
          {analyticsData && <BarGraph data={analyticsData} />}
        </div>
      </div>
    </div>
  );
}

export default Main;