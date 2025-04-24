import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import axios from "axios";
// import Header from "./Header"; // --- Keep Header REMOVED ---

// --- Data for the Nutrition Tips ---
// (Defined outside the main component for clarity)
const nutritionTipsData = [
  // ... (Keep the nutritionTipsData array as defined before)
  {
    id: 'tip1',
    title: 'Hydration is Key',
    shortText: 'Staying hydrated is crucial for energy levels and overall health. Water helps transport nutrients...',
    fullText: 'Staying hydrated is crucial for energy levels, digestion, and overall health. Water helps transport nutrients, regulate body temperature, and lubricate joints. Aim for at least 8 glasses (64 ounces) per day, and more if you are very active or in hot weather. Listen to your body; thirst is a sign you\'re already starting to dehydrate.'
  },
  {
    id: 'tip2',
    title: 'Prioritize Protein',
    shortText: 'Include lean protein sources in your meals to support muscle repair, growth, and satiety...',
    fullText: 'Include lean protein sources like chicken, fish, beans, lentils, tofu, and Greek yogurt in your meals. Protein is essential for muscle repair and growth, especially after workouts. It also helps you feel fuller for longer, which can aid in weight management by reducing overall calorie intake. Aim for a protein source with each main meal.'
  },
  {
    id: 'tip3',
    title: 'Embrace Colorful Veggies',
    shortText: 'Fill your plate with a variety of colorful vegetables. They are packed with essential vitamins...',
    fullText: 'Fill at least half your plate with a variety of colorful vegetables like leafy greens, bell peppers, carrots, broccoli, and tomatoes. Different colors often indicate different vitamins, minerals, and antioxidants. These nutrients are vital for immune function, energy production, and protecting your body against cellular damage. Aim for at least 5 servings daily.'
  },
  {
    id: 'tip4',
    title: 'Mindful Eating Matters',
    shortText: 'Pay attention to your meals. Eating slowly and savoring your food can improve digestion and help...',
    fullText: 'Practice mindful eating by paying attention to your meals without distractions like screens. Eat slowly, chew thoroughly, and savor the flavors and textures of your food. This improves digestion and nutrient absorption. It also helps you recognize your body\'s natural hunger and fullness signals, preventing overeating and fostering a healthier relationship with food.'
  },
];


// --- NutritionTipsFlex Component Definition ---
// (Defined outside the main component, but within the same file)
function NutritionTipsFlex() {
  // State to keep track of which tips are expanded { tipId: boolean }
  const [expandedTips, setExpandedTips] = useState({});

  // Function to toggle the expanded state for a specific tip
  const toggleTip = (tipId) => {
    setExpandedTips(prevState => ({
      ...prevState, // Keep the state of other tips
      [tipId]: !prevState[tipId] // Toggle the state for the clicked tip (true/false)
    }));
  };

  return (
    // Main container for the entire section - Spanning 2 columns on medium screens
    <div className="bg-white dark:bg-zinc-800 shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 rounded-lg md:col-span-2">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center sm:text-left">
        🍎 Nutrition Tips
      </h2>
      {/* Flex container for the individual tip cards */}
      <div className="flex flex-wrap gap-4 justify-center">
        {nutritionTipsData.map((tip) => {
          // Check if the current tip is expanded (defaults to false if not in state)
          const isExpanded = !!expandedTips[tip.id];
          // Determine if the button should be shown (only if full text is longer)
          const showButton = tip.fullText.length > tip.shortText.length;

          return (
            // Individual tip card
            <div
              key={tip.id}
              className="flex-1 min-w-[240px] max-w-sm border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-700 p-4 rounded-md flex flex-col transition-all duration-300" // Card styling
            >
              {/* Optional Tip Title */}
              {tip.title && (
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  {tip.title}
                </h3>
              )}

              {/* Tip Text Paragraph */}
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-grow"> {/* flex-grow pushes button down */}
                {isExpanded ? tip.fullText : tip.shortText}
                {!isExpanded && showButton ? '...' : ''} {/* Show ellipsis if collapsed and more text exists */}
              </p>

              {/* Read More / Read Less Button */}
              {showButton && ( // Only render button if needed
                <button
                  onClick={() => toggleTip(tip.id)}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-xs mt-3 self-start" // Align button left
                  aria-expanded={isExpanded} // Accessibility hint
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Main MemberDashboard Component ---
export default function MemberDashboard() {
  const navigate = useNavigate();
  // Retrieve userId from local storage
  const userId = localStorage.getItem("userId");
  // State variables for user data fetched from the API
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- State for BMI Calculator ---
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  // --- State for Profile Editing ---
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  // --- Fetch User Data Effect ---
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      if (!userId) {
        setError("User ID not found. Please log in again.");
        setLoading(false);
        navigate('/signin');
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/dashboard/${userId}/`
        );
        console.log("User data received:", response.data);
        setUserData(response.data);
        setUserName(response.data.user?.username || "");
        setEmail(response.data.user?.email || "");
        setError(null);
      } catch (err) {
        console.error("API Error fetching user data:", err);
        let errorMessage = "Failed to fetch user data.";
        // ... (Keep existing error handling logic) ...
        if (err.response) {
          errorMessage = `Failed to fetch user data. Status: ${err.response.status} - ${err.response.statusText}`;
           if (err.response.status === 404) {
             errorMessage = `User data not found for ID ${userId}. Please check the ID or contact support.`;
           }
        } else if (err.request) {
          errorMessage = "Network error or server not responding.";
        } else {
          errorMessage = err.message;
        }
        setError(errorMessage);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

  }, [userId, navigate]); // Added navigate to dependency array

  // --- BMI Calculation Function ---
  const calculateBMI = () => {
    if (!height || height <= 0 || !weight || weight <= 0) {
        alert("Please enter valid positive numbers for weight and height."); // Consider toast
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

  // --- Profile Save Handler ---
  const handleSaveProfile = async () => {
     if (!userId) {
       alert("Cannot save profile: User ID is missing."); // Consider toast
       return;
     }
    // Basic validation
    if (!userName.trim() || !email.trim()) {
       alert("Username and Email cannot be empty."); // Consider toast
       return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Please enter a valid email address."); // Consider toast
        return;
    }

    try {
      // Using PUT or PATCH based on your API
      const response = await axios.put( // Or axios.patch
        `http://localhost:8000/dashboard/${userId}/`,
        {
          username: userName,
          email: email,
        }
      );
      console.log("Profile update response:", response.data);
      // Update local state based on response
      setUserData(prevData => ({
        ...prevData,
        user: response.data.user || { ...prevData.user, username: userName, email: email }
      }));
      setIsEditing(false);
      alert("Profile updated successfully!"); // Consider toast

    } catch (err) {
      console.error("Error updating profile:", err);
       let errorMsg = "Error updating profile.";
       // ... (Keep existing error handling logic) ...
        if (err.response) {
            errorMsg += ` Status: ${err.response.status}. ${JSON.stringify(err.response.data)}`;
        } else if (err.request) {
             errorMsg += " No response from server.";
        } else {
            errorMsg += ` ${err.message}`;
        }
      alert(`${errorMsg}`); // Consider toast
    }
  };

  // --- Sign Out Handler ---
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("savedEvents");
    navigate("/signin");
    // Optional: Update global state if applicable
  };


  // --- Render Loading/Error States ---
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading user data...</div>;
  }

  if (error) {
     return (
        <div className="flex flex-col justify-center items-center h-screen p-6">
            <div className="p-6 text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded max-w-md text-center">
                <p className="font-semibold mb-2">Error</p>
                <p className="mb-4">{error}</p>
                <button
                    onClick={() => navigate('/signin')}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors duration-200"
                >
                    Go to Sign In
                </button>
            </div>
        </div>
    );
  }

  // Check if essential userData exists (including member for membership card)
  if (!userData || !userData.user || !userData.member) { // Added check for .member back
    return <div className="p-6 text-center mt-10">User data could not be loaded correctly or is incomplete. Please try signing in again.</div>;
  }


  // --- Main Render ---
  return (
    // Main container div for the whole page
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900">
      {/* <Header /> --- REMOVED --- */}

      {/* Main content grid - Using grid again, adjusted padding-top */}
      <div className="px-4 sm:px-6 lg:px-8 pt-10 pb-24 grid gap-6 grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto relative"> {/* Increased pb, relative positioning */}

        {/* --- Profile Section --- */}
        <div className="bg-white dark:bg-zinc-800 shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">My Profile</h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Name:{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full border border-gray-300 dark:border-zinc-600 rounded p-2 mt-1 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <strong className="text-gray-900 dark:text-white">{userData.user.username}</strong>
              )}
            </p>
             <p className="text-sm text-gray-600 dark:text-gray-300">
              Email:{" "}
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                   className="w-full border border-gray-300 dark:border-zinc-600 rounded p-2 mt-1 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <strong className="text-gray-900 dark:text-white">{userData.user.email}</strong>
              )}
            </p>
          </div>
           <button
            onClick={() => {
                if (isEditing) {
                    setUserName(userData.user.username);
                    setEmail(userData.user.email);
                }
                setIsEditing(!isEditing);
            }}
            className={`w-full text-white p-2 mt-4 rounded transition-colors duration-200 ${
              isEditing
                ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                : "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
            }`}
          >
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>
          {isEditing && (
            <button
              onClick={handleSaveProfile}
              className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white p-2 mt-2 rounded transition-colors duration-200"
            >
              Save Changes
            </button>
          )}
        </div>

        {/* --- BMI Calculator --- */}
        <div className="bg-white dark:bg-zinc-800 shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">BMI Calculator</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight (kg)</label>
              <input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                placeholder="Enter your weight"
                className="w-full border border-gray-300 dark:border-zinc-600 rounded p-2 mt-1 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Height (cm)</label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                placeholder="Enter your height"
                 className="w-full border border-gray-300 dark:border-zinc-600 rounded p-2 mt-1 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={calculateBMI}
              className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white p-2 mt-4 rounded transition-colors duration-200"
            >
              Calculate BMI
            </button>
            {bmi !== null && (
              <div className="mt-4 bg-gray-100 dark:bg-zinc-700 p-4 rounded-lg border border-gray-200 dark:border-zinc-600">
                <p className="text-lg font-semibold text-gray-800 dark:text-white">Your BMI: {bmi}</p>
                <p className={`text-sm font-medium ${category === "Underweight" ? 'text-blue-600 dark:text-blue-400' : category === "Normal weight" ? 'text-green-600 dark:text-green-400' : category === "Overweight" ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                  Category: {category}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- Membership Info --- */}
        <div className="bg-white dark:bg-zinc-800 shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Membership</h2>
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
            Plan: <strong className="text-gray-900 dark:text-white">{userData.member.membership_type || 'N/A'}</strong>
          </p>
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
            Expires: <strong className="text-gray-900 dark:text-white">{userData.member.membership_end_date ? new Date(userData.member.membership_end_date).toLocaleDateString() : 'N/A'}</strong>
          </p>
           {/* Add more member details if needed */}
        </div>

        {/* --- Attendance Tracker --- */}
        <div className="bg-white dark:bg-zinc-800 shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Attendance</h2>
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
            Total days attended this period: <strong className="text-gray-900 dark:text-white text-lg">{userData.attendance ?? '0'}</strong>
          </p>
          {/* Link to history? */}
        </div>

        {/* --- Settings Link --- */}
        <div className="bg-white dark:bg-zinc-800 shadow-xl hover:shadow-2xl transition-shadow duration-300 p-4 rounded-lg text-center">
             <Link
                to="/settings"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
             >
                Account Settings
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage other account details.</p>
        </div>

        {/* --- Events Link --- */}
        <div className="bg-white dark:bg-zinc-800 shadow-xl hover:shadow-2xl transition-shadow duration-300 p-4 rounded-lg text-center">
            <Link
                to="/gymevent"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
                View Gym Events
            </Link>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Check upcoming classes.</p>
        </div>

        {/* --- Nutrition Tips Section --- */}
        <NutritionTipsFlex /> {/* Spans 2 columns internally */}

      </div> {/* End of main content grid */}

       {/* --- Sign Out Button (Placed below the grid) --- */}
        <div className="px-4 sm:px-6 lg:px-8 pb-10 max-w-6xl mx-auto">
             <button
                onClick={handleSignOut}
                className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white p-3 rounded-lg transition-colors duration-200 font-semibold"
            >
                Sign Out
            </button>
        </div>

    </div> // End of main container div
  );
}