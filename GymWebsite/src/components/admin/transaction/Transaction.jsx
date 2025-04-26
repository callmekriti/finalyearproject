import React, { useState, useEffect } from "react";
import axios from "axios";

function Transaction() {
  const [membershipTypes, setMembershipTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    
    if (searchValue === "") {
      setFilteredTypes(membershipTypes);
    } else {
      setFilteredTypes(
        membershipTypes.filter((type) =>
          type.type_name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    const fetchMembershipTypes = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/membershipTypes/");
        const data = response?.data?.data || [];
        
        // Add transaction IDs for display purposes
        const processedData = data.map(type => ({
          ...type,
          transactionId: generateRandomId(),
          status: Math.random() > 0.3 ? "Completed" : "Pending" // Simulate different statuses
        }));  
        
        setMembershipTypes(processedData);
        setFilteredTypes(processedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load membership types data");
        setMembershipTypes([]);
        setFilteredTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipTypes();
  }, []);

  function generateRandomId() {
    return `TRX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-4 text-gray-600">Loading membership types...</span>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className=" sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
        <p className="mt-2 text-sm text-gray-600">View and manage your membership transactions</p>
      </div>

      <div className="mb-6">
        <div className="relative rounded-md shadow-sm max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            onChange={handleSearch}
            value={search}
            placeholder="Search by package name..."
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-3 border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {filteredTypes.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No transactions found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {filteredTypes.map((type) => (
              <li key={type.membership_type_id}>
                <div className="px-4 py-5 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="col-span-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</p>
                      <p className="mt-1 text-sm font-medium text-blue-600">{type.transactionId}</p>
                    </div>
                    
                    <div className="col-span-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Package ID</p>
                      <p className="mt-1 text-sm text-gray-900">{type.membership_type_id}</p>
                    </div>
                    
                    <div className="col-span-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Package</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">{type.type_name}</p>
                    </div>
                    
                    <div className="col-span-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</p>
                      <p className="mt-1 text-sm text-gray-900">{type.duration} months</p>
                    </div>
                    
                    <div className="col-span-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Price</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">${type.price}</p>
                    </div>
                    
                    <div className="col-span-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</p>
                      <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(type.status)}`}>
                        {type.status}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Transaction;