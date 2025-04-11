import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { format } from "date-fns";
import { MdDelete } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";
import GlobalContext from "../../context/GlobalContext";

function MembersTable({ searchQuery, onEdit }) {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [membershipTypes, setMembershipTypes] = useState([]); // Store membership types
  const { fetchMembersCount } = useContext(GlobalContext);

  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/members/");
        console.log("Members API Response:", response.data); // Debugging
        setMembers(response?.data?.data || []);
        setFilteredMembers(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching members:", error);
        setMembers([]);
        setFilteredMembers([]);
      }
    };

    fetchMembers();
  }, []);

  // Fetch membership types
  useEffect(() => {
    const fetchMembershipTypes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/membershipTypes/");
        console.log("Membership Types API Response:", response.data); // Debugging
        setMembershipTypes(response?.data?.data || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching membership types:", error);
        setMembershipTypes([]);
      }
    };

    fetchMembershipTypes();
  }, []);

  // Filter members based on search query
  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = members.filter(
        (member) =>
          member.name.toLowerCase().includes(lowerCaseQuery) ||
          member.email.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }
  }, [searchQuery, members]);

  // Function to delete a member
  const deleteMember = async (id) => {
    if (!id) {
      console.error("No ID provided for deletion");
      return;
    }

    try {
      const response = await axios.delete(`http://127.0.0.1:8000/members/${id}/`);
      if (response.status === 200) {
        const updatedMembers = members.filter((member) => member.member_id !== id);
        setMembers(updatedMembers);
        setFilteredMembers(updatedMembers);
        fetchMembersCount();
      }
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto shadow-lg rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date of Birth
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Membership Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.map((member) => {
              // Ensure membershipTypes is an array before using find()
              const membershipType =
                Array.isArray(membershipTypes) &&
                membershipTypes.find(
                  (type) => type.membership_type_id === member.membership_type
                )?.type_name || "Unknown";

              return (
                <tr key={member.member_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.member_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {member.email}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {member.phone_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.address}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {format(new Date(member.date_of_birth), "MM/dd/yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {membershipType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(member.membership_start_date), "MM/dd/yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(member.membership_end_date), "MM/dd/yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="pl-0" onClick={() => onEdit(member)}>
                      <FaPenToSquare />
                    </button>
                    <button
                      className="pl-4"
                      onClick={() => deleteMember(member.member_id)}
                    >
                      <MdDelete className="text-red-600 text-xl" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MembersTable;
