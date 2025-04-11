import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from "axios"; // Import axios for making API requests

export default function MemberDashboard() {
  const navigate = useNavigate();
  // Retrieve userId from local storage
  const userId = localStorage.getItem("userId");
  // State variables for user data fetched from the API
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState(""); // Initialize from userData
  const [email, setEmail] = useState(""); // Initialize from userData

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Start loading

      try {
        // Make a GET request to your API endpoint
        const response = await axios.get(
          `http://localhost:8000/dashboard/${userId}/`
        );

        // Check if the request was successful (status code 200)
        if (response.status === 200) {
            console.log(response.data);
          // Update the state with the fetched user data
          setUserData(response.data);
          setUserName(response.data.username || ""); // Initialize userName
          setEmail(response.data.email || ""); // Initialize email
          setError(null); // Clear any previous errors
        } else {
          // If the request was not successful, handle the error
          setError(`Failed to fetch user data. Status code: ${response.status}`);
        }
      } catch (err) {
        // Handle any errors that occurred during the API call
        setError(err.message || "Failed to fetch user data.");
      } finally {
        // Set loading to false, whether the request was successful or not
        setLoading(false);
      }
    };

    // Call the fetchUserData function when the component mounts
    if (userId) {
      fetchUserData();
    } else {
      setError("User ID not found in local storage.");
      setLoading(false);
    }
  }, [userId]); // useEffect dependency on userId


  const calculateBMI = () => {
    if (height <= 0 || weight <= 0) return;
    const heightInMeters = height / 100;
    const bmiVal = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(bmiVal);

    if (bmiVal < 18.5) setCategory("Underweight");
    else if (bmiVal < 24.9) setCategory("Normal weight");
    else if (bmiVal < 29.9) setCategory("Overweight");
    else setCategory("Obese");
  };

  const handleSaveProfile = async () => {
    // Implement logic to save the profile changes to the API
    try {
      // Make a PUT or PATCH request to update the user data
      const response = await axios.put(
        `http://localhost:8000/dashboard/${userId}/`, // Replace with your API endpoint
        {
          username: userName,
          email: email,
        }
      );

      if (response.status === 200) {
        
        // Update the local state with the new data
        setUserData(response.data);
        setIsEditing(false);
      } else {
        console.error("Failed to update profile", response);
        alert("Failed to update profile.  Check the console for details.");
      }
    } catch (err) {
      console.error("Error updating profile", err);
      alert("Error updating profile. Check the console for details.");
    }
  };


  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>No user data available.</div>;
  }


  return (
    <div>
      <Header />

      <div className="p-6 grid gap-6 grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto py-8">
        {/* Profile Section */}
        <div className="shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <div>
            <p className="text-sm">
              Name:{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full border p-2"
                />
              ) : (
                <strong>{userData.user.username}</strong> // Display username from API
              )}
            </p>
          </div>
          <div>
            <p className="text-sm">
              Email:{" "}
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border p-2"
                />
              ) : (
                <strong>{userData.user.email}</strong> // Display email from API
              )}
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-full bg-yellow-500 text-white p-2 mt-4"
          >
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>
          {isEditing && (
            <button
              onClick={handleSaveProfile}
              className="w-full bg-green-500 text-white p-2 mt-4"
            >
              Save Changes
            </button>
          )}
        </div>

        {/* BMI Calculator */}
        <div className="shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6">
          <h2 className="text-2xl font-bold mb-4">BMI Calculator</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="weight">Weight (kg)</label>
              <input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                placeholder="Enter your weight"
                className="w-full border p-2"
              />
            </div>
            <div>
              <label htmlFor="height">Height (cm)</label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value))}
                placeholder="Enter your height"
                className="w-full border p-2"
              />
            </div>
            <button
              onClick={calculateBMI}
              className="w-full bg-blue-500 text-white p-2 mt-4"
            >
              Calculate BMI
            </button>
            {bmi && (
              <div className="mt-4 bg-gray-100 p-4 rounded-xl">
                <p className="text-lg font-semibold">Your BMI: {bmi}</p>
                <p className="text-sm text-muted">Category: {category}</p>
              </div>
            )}
          </div>
        </div>

        {/* Membership Info */}
        <div className="shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6">
          <h2 className="text-2xl font-bold mb-4">Membership Status</h2>
          <p className="mb-2 text-sm">
            Plan: <strong>{userData.member.membership_type}</strong>
          </p>
          <p className="mb-2 text-sm">
                Expires: <strong>{userData.member.membership_end_date}</strong>
          </p>
          <button className="w-full bg-green-500 text-white p-2 mt-2">
            Renew / Upgrade
          </button>
        </div>

        

        {/* Attendance Tracker */}
        <div className="shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6">
          <h2 className="text-2xl font-bold mb-4">Attendance</h2>
          <p className="mb-2 text-sm">
            Total days attended this month: <strong>12</strong>
          </p>
          <div className="bg-gray-200 h-2 mb-1">
            <div
              style={{ width: "60%" }}
              className="bg-blue-500 h-full"
            ></div>
          </div>
          <p className="text-xs text-muted">Goal: 20 days</p>
        </div>

        {/* Diet Tips */}
        <div className="shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6">
          <h2 className="text-2xl font-bold mb-4">🍎 Nutrition Tip</h2>
          <p className="text-sm">
            Stay hydrated and include protein in every meal to support muscle
            recovery and fat loss.
          </p>
        </div>

      </div>
    </div>
  );
}