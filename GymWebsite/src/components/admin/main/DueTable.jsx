import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

function DueTable() {
  const [dues, setDues] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [duesResponse, membersResponse] = await Promise.all([
          axios.get("http://localhost:8000/dues/"),
          axios.get("http://localhost:8000/members/")
        ]);
  
        console.log("Dues fetched:", duesResponse.data);
        console.log("Members fetched:", membersResponse.data);
  
        // Ensure we are storing an array
        setDues(Array.isArray(duesResponse.data) ? duesResponse.data : []);
        setMembers(Array.isArray(membersResponse.data.data) ? membersResponse.data.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  
   console.log("memebers" ,members)
    console.log("dues" ,dues)
  // Combine dues with member information only if both dues and members are available
  const duesWithMemberInfo = Array.isArray(members) && Array.isArray(dues)
    ? dues.map(due => {
      const member = members.find(m => m.member_id === due.member);
      return {
        ...due,
        memberName: member ? member.name : "Unknown Member",
        membershipStartDate: member ? member.membership_start_date : null
      };
    })
  : [];

  
  console.log("Dues with Member Info:", duesWithMemberInfo); // Log the combined data

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-black">Due Members</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="border-t-2 border-b-2">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Membership Start Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {duesWithMemberInfo.map((due) => (
            <tr key={due.id}>
              <td className="text-black px-6 py-4 whitespace-nowrap">
                {due.memberName}
              </td>
              <td className="text-black px-6 py-4 whitespace-nowrap">
                {due.amount}
              </td>
              <td className="text-black px-6 py-4 whitespace-nowrap">
                {due.membershipStartDate ? format(new Date(due.membershipStartDate), "MM/dd/yyyy") : "N/A"}
              </td>
              <td className="text-black px-6 py-4 whitespace-nowrap">
                {due.paid ? "Paid" : "Unpaid"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DueTable;