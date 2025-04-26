import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { format } from "date-fns";
import { MdDelete, MdEdit } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import GlobalContext from "../../context/GlobalContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MembersTable({ searchQuery, onEdit }) {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [membershipTypes, setMembershipTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchMembersCount } = useContext(GlobalContext);

  // Fetch members and membership types
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [membersRes, typesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/members/"),
          axios.get("http://127.0.0.1:8000/membershipTypes/")
        ]);
        
        setMembers(membersRes?.data?.data || []);
        setFilteredMembers(membersRes?.data?.data || []);
        setMembershipTypes(typesRes?.data?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load member data");
        setMembers([]);
        setFilteredMembers([]);
        setMembershipTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter members based on search query
  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = members.filter(
        (member) =>
          (member.name && member.name.toLowerCase().includes(lowerCaseQuery)) ||
          (member.email && member.email.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }
  }, [searchQuery, members]);

  // Delete a member with confirmation
  const deleteMember = async (id) => {
    if (!id) {
      toast.error("No member selected for deletion");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this member?")) {
      return;
    }

    try {
      const response = await axios.delete(`http://127.0.0.1:8000/members/${id}/`);
      if (response.status === 200) {
        const updatedMembers = members.filter((member) => member.member_id !== id);
        setMembers(updatedMembers);
        setFilteredMembers(updatedMembers);
        fetchMembersCount();
        toast.success("Member deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Failed to delete member");
    }
  };

  // Get membership type name
  const getMembershipType = (typeId) => {
    const type = membershipTypes.find(t => t.membership_type_id === typeId);
    return type?.type_name || "Unknown";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Membership
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">
                  {members.length === 0 ? "No members found" : "No matching members found"}
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr key={member.member_id} className="hover:bg-gray-50 transition-colors duration-150">
                  {/* Member Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">ID: {member.member_id}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Contact Info */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{member.email || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{member.phone_number || 'N/A'}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{member.address || 'N/A'}</div>
                  </td>
                  
                  {/* Membership Info */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {getMembershipType(member.membership_type)}
                    </div>
                    <div className="text-sm text-gray-500">
                      DOB: {format(new Date(member.date_of_birth), "MMM d, yyyy")}
                    </div>
                  </td>
                  
                  {/* Date Info */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">Start:</span> {format(new Date(member.membership_start_date), "MMM d, yyyy")}
                    </div>
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">End:</span> {format(new Date(member.membership_end_date), "MMM d, yyyy")}
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit(member)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                        title="Edit"
                      >
                        <MdEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteMember(member.member_id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                        title="Delete"
                      >
                        <MdDelete className="h-5 w-5" />
                      </button>
                    </div>
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

export default MembersTable;