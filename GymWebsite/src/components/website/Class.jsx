import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
function NavBar({ handleSignOut, showBmiCalculator, setShowBmiCalculator }) {
  return (
    <nav className="bg-white dark:bg-zinc-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">GymApp</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link 
                  to="/dashboard" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 dark:bg-blue-700"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => setShowBmiCalculator(!showBmiCalculator)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    showBmiCalculator 
                      ? 'text-white bg-green-600 dark:bg-green-700' 
                      : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  BMI Calculator
                </button>
                <Link 
                  to="/gymevent" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Events
                </Link>
                <Link 
                  to="/classes" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Classes
                </Link>
                <Link 
                  to="/settings" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Settings
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              >
                Sign Out
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            {/* Mobile menu button would go here */}
          </div>
        </div>
      </div>
    </nav>
  );
}

const Class = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [trainers, setTrainers] = useState([]);
    const navigate=useNavigate();
  const API_ENDPOINT = 'http://localhost:8000/classes/';
  const TRAINER_API_ENDPOINT = 'http://localhost:8000/trainers/';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesResponse, trainersResponse] = await Promise.all([
          axios.get(API_ENDPOINT),
          axios.get(TRAINER_API_ENDPOINT),
        ]);
        console.log(classesResponse.data)
        setClasses(classesResponse.data);
        setTrainers(trainersResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data. Please check the server.');
      }
    };

    fetchData();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("savedEvents");
    navigate("/signin");
  };

  return (
    <div className="bg-gray-100 min-h-screen ">
        <NavBar handleSignOut={handleSignOut} />
      <div className="mt-10 container mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Available Classes
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Class List */}
        {classes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Class Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trainer
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Timing
                  </th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{c.name}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {trainers.find(t => t.id === c.trainer_id)?.name || 'Unknown'}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {c.timing ? new Date(c.timing).toLocaleString() : 'N/A'}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No classes available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Class;   