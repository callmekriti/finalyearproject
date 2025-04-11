import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format} from 'date-fns';
import { Link } from 'react-router-dom';

const UserInfoCard = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    contact: "",
    email: "",
    address: "",
    dateOfBirth: '',

    membershipStartDate: '',
   
    membershipEndDate: '',
    membershipType: "",
   

  });

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      fetchData(userId);
    }
  }, []);

  const fetchData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/members/${id}/`);
      if (response.data.statusCode === 200) {
        const userData = response.data.data;
        setUser(userData);
        setFormData({
          name: userData.name,
          username: userData.username,
          password: userData.password,

          email: userData.email,

          phoneNumber: userData.phoneNumber,
          address: userData.address,
          dateOfBirth: format(new Date(userData.dateOfBirth), 'yyyy-MM-dd'),
          membershipStartDate: format(new Date(userData.membershipStartDate), 'yyyy-MM-dd'),
          membershipEndDate: format(new Date(userData.membershipEndDate), 'yyyy-MM-dd'),
          membershipType: userData.membershipType ? userData.membershipType.membershipTypeId : '',

        });
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('user_id');
    try {
      const response = await axios.put(`http://localhost:8000/members/${userId}`, {
        ...formData,
        dateOfBirth: format(new Date(formData.dateOfBirth), 'yyyy-MM-dd')
      });
      if (response.data.statusCode === 200) {
        setUser((prevUser) => ({
          ...prevUser,
          ...formData
        }));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating data', error);
    }
  };

  const calculateDaysLeft = () => {
    if (user && user.membershipEndDate) {
      const endDate = new Date(user.membershipEndDate);
      const today = new Date();
      return Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const daysLeft = calculateDaysLeft();

  if (!user) {
    return <div className="flex items-center justify-center h-screen text-gray-600">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 min-h-screen py-6">
      <div className="w-full max-w-4xl bg-blue-600 p-4 flex justify-between items-center shadow-md rounded-md">
        <Link to="/">
          <button className="bg-white text-blue-600 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100">
            Back
          </button>
        </Link>
        <div className="text-white font-semibold text-lg">
          {daysLeft > 0 ? `Days left to next payment: ${daysLeft}` : 'Membership has ended'}
        </div>
      </div>
      <div className="max-w-4xl w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6">
        <div className="px-6 py-6">
          <div className="font-bold text-2xl mb-4 text-center text-blue-600">User Information</div>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow-md appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="shadow-md appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="shadow-md appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="shadow-md appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="shadow-md appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <ul className="space-y-2">
              <li className="py-2 border-b border-gray-300">
                <span className="font-semibold text-gray-800">Name:</span> {user.name}
              </li>
              <li className="py-2 border-b border-gray-300">
                <span className="font-semibold text-gray-800">Email:</span> {user.email}
              </li>
              <li className="py-2 border-b border-gray-300">
                <span className="font-semibold text-gray-800">Phone Number:</span> {user.phoneNumber}
              </li>
              <li className="py-2 border-b border-gray-300">
                <span className="font-semibold text-gray-800">Address:</span> {user.address}
              </li>
              <li className="py-2 border-b border-gray-300">
                <span className="font-semibold text-gray-800">Date of Birth:</span> {format(new Date(user.dateOfBirth), 'MM/dd/yyyy')}
              </li>
              {!isEditing && (
                <>
                  <li className="py-2 border-b border-gray-300">
                    <span className="font-semibold text-gray-800">Membership Start Date:</span> {format(new Date(user.membershipStartDate), 'MM/dd/yyyy')}
                  </li>
                  <li className="py-2 border-b border-gray-300">
                    <span className="font-semibold text-gray-800">Membership End Date:</span> {format(new Date(user.membershipEndDate), 'MM/dd/yyyy')}
                  </li>
                </>
              )}
            </ul>
          )}
          {!isEditing && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
