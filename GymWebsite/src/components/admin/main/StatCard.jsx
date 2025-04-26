import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const StatCard = ({ icon, title, value, trend, trendValue }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
    <div className="flex justify-between items-start">
      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-opacity-20 bg-blue-100">
        {icon}
      </div>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {trend === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
        {trendValue}
      </span>
    </div>
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default StatCard;