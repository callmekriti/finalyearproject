import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

function DueTable() {
  const [dues, setDues] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [duesResponse, membersResponse] = await Promise.all([
          axios.get("http://localhost:8000/dues/"),
          axios.get("http://localhost:8000/members/")
        ]);
        
        setDues(Array.isArray(duesResponse.data) ? duesResponse.data : []);
        setMembers(Array.isArray(membersResponse.data?.data) ? membersResponse.data.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load due payments data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const duesWithMemberInfo = members.length && dues.length
    ? dues.map(due => {
        const member = members.find(m => m.member_id === due.member);
        return {
          ...due,
          memberName: member?.name || "Unknown Member",
          membershipStartDate: member?.membership_start_date || null,
          email: member?.email || "N/A"
        };
      })
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <FiAlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Due Payments</h2>
        <p className="mt-1 text-sm text-gray-600">
          {duesWithMemberInfo.length} {duesWithMemberInfo.length === 1 ? 'payment' : 'payments'} due
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {duesWithMemberInfo.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                  No due payments found
                </td>
              </tr>
            ) : (
              duesWithMemberInfo.map((due) => (
                <tr key={due.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {due.memberName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{due.memberName}</div>
                        <div className="text-sm text-gray-500">{due.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">${due.amount}</div>
                    <div className="text-xs text-gray-500">
                      Since {due.membershipStartDate ? format(new Date(due.membershipStartDate), "MMM d, yyyy") : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      due.paid 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {due.paid ? (
                        <>
                          <FiCheckCircle className="mr-1" /> Paid
                        </>
                      ) : (
                        <>
                          <FiAlertTriangle className="mr-1" /> Unpaid
                        </>
                      )}
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
}

export default DueTable;