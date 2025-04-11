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

      // Ensure userId exists before making the API call
      if (!userId) {
        setError("User ID not found in local storage. Cannot fetch data.");
        setLoading(false);
        // Optional: Redirect to login or show a message
        // navigate('/login');
        return; // Stop execution if userId is missing
      }

      try {
        // Make a GET request to your API endpoint
        const response = await axios.get(
          `http://localhost:8000/dashboard/${userId}/`
        );

        // Check if the request was successful (status code 200)
        // Axios automatically throws for non-2xx status codes,
        // so we usually check response.data directly here.
        console.log("User data received:", response.data);
        // Update the state with the fetched user data
        setUserData(response.data);
        setUserName(response.data.user?.username || ""); // Initialize userName safely
        setEmail(response.data.user?.email || ""); // Initialize email safely
        setError(null); // Clear any previous errors

      } catch (err) {
        // Handle any errors that occurred during the API call
        console.error("API Error:", err);
        let errorMessage = "Failed to fetch user data.";
        if (err.response) {
          // Server responded with a status code outside the 2xx range
          errorMessage = `Failed to fetch user data. Status: ${err.response.status} - ${err.response.statusText}`;
           if (err.response.status === 404) {
             errorMessage = `User data not found for ID ${userId}. Please check the ID or contact support.`;
           }
        } else if (err.request) {
          // The request was made but no response was received
          errorMessage = "Network error or server not responding. Please check your connection.";
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage = err.message;
        }
        setError(errorMessage);
        setUserData(null); // Clear potentially stale data on error
      } finally {
        // Set loading to false, whether the request was successful or not
        setLoading(false);
      }
    };

    fetchUserData(); // Call the function

  }, [userId]); // useEffect dependency on userId


  const calculateBMI = () => {
    // Add validation for realistic height/weight if desired
    if (!height || height <= 0 || !weight || weight <= 0) {
        alert("Please enter valid positive numbers for weight and height.");
        return;
    }
    const heightInMeters = height / 100;
    const bmiVal = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(bmiVal);

    if (bmiVal < 18.5) setCategory("Underweight");
    else if (bmiVal < 24.9) setCategory("Normal weight");
    else if (bmiVal < 29.9) setCategory("Overweight");
    else setCategory("Obese");
  };

  const handleSaveProfile = async () => {
     if (!userId) {
       alert("Cannot save profile: User ID is missing.");
       return;
     }
    // Basic validation
    if (!userName.trim() || !email.trim()) {
       alert("Username and Email cannot be empty.");
       return;
    }
    // Optional: more robust email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    try {
      // Make a PUT or PATCH request to update the user data
      // Using PUT implies replacing the entire user resource (or the parts you send)
      // Using PATCH is for partial updates. Choose based on your API design.
      const response = await axios.put(
        `http://localhost:8000/dashboard/${userId}/`, // Ensure this endpoint expects PUT for user update
        {
          // Only send the fields intended for update related to the user profile
          // Adjust the payload based on what your API expects for updating the user part
          username: userName,
          email: email,
          // Note: You might need to send other user fields if your API expects the full user object
          // Or your API might be designed to only update the provided fields (like a PATCH)
        }
      );

      console.log("Profile update response:", response.data);

      // Update the local state *only for the parts that changed*
      // It's often better to update based on the response data if the API returns the updated object
      setUserData(prevData => ({
        ...prevData, // Keep existing data (member info, attendance etc.)
        user: response.data.user || { ...prevData.user, username: userName, email: email } // Update user part, ideally from response
      }));
      setIsEditing(false); // Exit editing mode
      alert("Profile updated successfully!"); // Provide user feedback

    } catch (err) {
      console.error("Error updating profile:", err);
       let errorMsg = "Error updating profile.";
        if (err.response) {
            errorMsg += ` Status: ${err.response.status}. ${JSON.stringify(err.response.data)}`;
        } else if (err.request) {
             errorMsg += " No response from server.";
        } else {
            errorMsg += ` ${err.message}`;
        }
      alert(`${errorMsg} Check the console for details.`);
    }
  };


  if (loading) {
    // Optional: Add a nicer loading spinner here
    return <div className="flex justify-center items-center h-screen">Loading user data...</div>;
  }

  if (error) {
    // Optional: Style the error message
    return <div className="p-6 text-red-600 bg-red-100 border border-red-400 rounded max-w-md mx-auto mt-10">Error: {error}</div>;
  }

  // Check if userData exists *and* if the nested properties exist before accessing them
  if (!userData || !userData.user || !userData.member) {
    return <div className="p-6 text-center mt-10">No user data available or data is incomplete.</div>;
  }


  return (
    <div className="min-h-screen bg-gray-50"> {/* Added a light background */}
      <Header />

      {/* ---- CHANGE HERE ---- */}
      {/* Added pt-20 (adjust as needed) to push content below header */}
      {/* Added pb-10 for bottom spacing */}
      <div className="px-4 sm:px-6 lg:px-8 pt-20 pb-10 grid gap-6 grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto">
        {/* Profile Section */}
        {/* Added rounded-lg for softer corners */}
        <div className="bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile</h2>
          <div className="space-y-3"> {/* Added space between items */}
            <p className="text-sm text-gray-600">
              Name:{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <strong className="text-gray-900">{userData.user.username}</strong> // Display username from API
              )}
            </p>
            <p className="text-sm text-gray-600">
              Email:{" "}
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <strong className="text-gray-900">{userData.user.email}</strong> // Display email from API
              )}
            </p>
          </div>
          {/* Buttons styling improved */}
          <button
            onClick={() => {
                if (isEditing) {
                    // Reset fields to original values when canceling
                    setUserName(userData.user.username);
                    setEmail(userData.user.email);
                }
                setIsEditing(!isEditing);
            }}
            className={`w-full text-white p-2 mt-4 rounded transition-colors duration-200 ${
              isEditing
                ? "bg-red-500 hover:bg-red-600"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>
          {isEditing && (
            <button
              onClick={handleSaveProfile}
              className="w-full bg-green-500 hover:bg-green-600 text-white p-2 mt-2 rounded transition-colors duration-200"
            >
              Save Changes
            </button>
          )}
        </div>

        {/* BMI Calculator */}
        <div className="bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">BMI Calculator</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)} // Handle potential NaN
                placeholder="Enter your weight"
                className="w-full border border-gray-300 rounded p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)} // Handle potential NaN
                placeholder="Enter your height"
                className="w-full border border-gray-300 rounded p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={calculateBMI}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 mt-4 rounded transition-colors duration-200"
            >
              Calculate BMI
            </button>
            {bmi !== null && ( // Check for null specifically, as 0 is a valid BMI (though unlikely)
              <div className="mt-4 bg-gray-100 p-4 rounded-lg border border-gray-200">
                <p className="text-lg font-semibold text-gray-800">Your BMI: {bmi}</p>
                <p className={`text-sm font-medium ${category === "Underweight" ? 'text-blue-600' : category === "Normal weight" ? 'text-green-600' : category === "Overweight" ? 'text-yellow-600' : 'text-red-600'}`}>
                  Category: {category}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Membership Info */}
        <div className="bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Membership Status</h2>
          <p className="mb-2 text-sm text-gray-600">
            Plan: <strong className="text-gray-900">{userData.member.membership_type || 'N/A'}</strong>
          </p>
          <p className="mb-2 text-sm text-gray-600">
                Expires: <strong className="text-gray-900">{userData.member.membership_end_date ? new Date(userData.member.membership_end_date).toLocaleDateString() : 'N/A'}</strong>
          </p>
          {/* You could add more details like start date, payment status etc. */}
        </div>

        {/* Attendance Tracker */}
        <div className="bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Attendance</h2>
          <p className="mb-2 text-sm text-gray-600">
            Total days attended this month: <strong className="text-gray-900">{userData.attendance ?? '0'}</strong> {/* Use nullish coalescing for default */}
          </p>
          {/* Consider adding a link to a detailed attendance view */}
        </div>

        {/* Diet Tips */}
        {/* Changed grid span to cover full width on medium screens if desired, or keep as is */}
        <div className="bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 rounded-lg md:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🍎 Nutrition Tip</h2>
          <p className="text-sm text-gray-700">
            Stay hydrated by drinking water throughout the day. Include lean protein (like chicken, fish, beans, or tofu) in every meal to support muscle recovery and help you feel full longer. Remember to eat plenty of colorful vegetables for essential vitamins and minerals!
          </p>
        </div>

      </div>
    </div>
  );
}