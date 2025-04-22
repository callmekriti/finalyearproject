import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import DandM from "../../assets/DandM.png";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";

// --- Helper Component: InputField ---
// Moved outside the Signin component to prevent re-definition on every render
const InputField = ({ id, label, type, placeholder, value, onChange, disabled, hasError }) => (
    <div className="mb-5">
        <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor={id}
        >
            {label}
        </label>
        <input
            className={`appearance-none block w-full bg-gray-50 text-gray-700 border ${
                // Added 'hasError' prop for more specific error styling if needed,
                // but keeping original logic based on global error for now.
                // Consider passing field-specific errors later if required.
                hasError ? 'border-red-500' : 'border-gray-300'
            } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:bg-gray-200 disabled:cursor-not-allowed`}
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required // Add required attribute for basic HTML validation
        />
    </div>
);


// --- Main Component: Signin ---
const Signin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // State for displaying general form errors
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Clear previous errors on new submission

        // Basic frontend validation (optional but good practice)
        if (!username || !password) {
             setError("Please enter both username and password.");
             setLoading(false);
             return;
        }

        try {
            console.log("Attempting login with:", { username }); // Avoid logging password in production
            const response = await axios.post("http://localhost:8000/login/", {
                username,
                password,
            });

            const { token, user_id, role } = response.data;

            // Basic validation of expected response data
            if (!token || !user_id || !role) {
                throw new Error("Incomplete login data received from server.");
            }

            localStorage.setItem("token", token);
            localStorage.setItem("userId", user_id);
            localStorage.setItem("role", role);

            console.log("Login successful. Role:", role);

            // Navigate based on role
            if (role === "admin") {
                navigate("/admin/dashboard", { replace: true });
            } else if (role === "trainer") {
                navigate("/trainerdashboard", { replace: true });
            } else {
                navigate("/dashboard", { replace: true });
            }

            // !!! Consider removing window.location.reload() !!!
            // It forces a hard refresh, losing React state and causing a less smooth UX.
            // React Router's navigation should handle the view update.
            // If you need to refresh data, fetch it within the target component's useEffect.
            // Keep it for now if it serves a specific purpose you haven't mentioned,
            // but it's generally not recommended in SPA navigation.
            window.location.reload();

        } catch (err) {
            console.error("Login error:", err.response || err.message || err);
            // Extract a user-friendly error message
            let errorMessage = "Invalid credentials or server error. Please try again.";
            if (err.response && err.response.data) {
                // Handle specific backend error messages if available
                if (typeof err.response.data.detail === 'string') {
                    errorMessage = err.response.data.detail; // Common DRF error format
                } else if (typeof err.response.data.non_field_errors === 'object' && Array.isArray(err.response.data.non_field_errors) && err.response.data.non_field_errors.length > 0) {
                    errorMessage = err.response.data.non_field_errors[0]; // Django non-field errors
                } else if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                }
                // You could add more specific checks for other potential error structures
            } else if (err.message === "Network Error") {
                errorMessage = "Cannot connect to the server. Please check your network.";
            } else if (err.message) {
                 errorMessage = err.message; // Fallback to generic error message
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
            <div className="flex w-full max-w-4xl shadow-xl rounded-xl overflow-hidden bg-white">

                {/* Image Section */}
                <div className="w-1/2 hidden md:block flex-shrink-0">
                    <img src={DandM} alt="Gym illustration" className="object-cover w-full h-full" />
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                        Welcome Back!
                    </h2>

                    {/* Error Message Display */}
                    {error && (
                        <div className="flex items-start bg-red-100 text-red-700 border border-red-300 rounded-md p-4 mb-6 text-sm" role="alert">
                            <FaExclamationTriangle className="mr-3 text-red-500 mt-0.5 flex-shrink-0" size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSignIn}>
                        <InputField
                            id="username"
                            label="Username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                            // Pass a flag indicating if there's an error and the field is related
                            // Here, we use the global 'error' state and check if the field is empty
                            // (matching original logic, but less precise than field-specific errors)
                            hasError={!!error && !username}
                        />

                        <InputField
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            hasError={!!error && !password}
                        />

                        <div className="mt-8 mb-6">
                            <button
                                className={`w-full flex items-center justify-center gap-2 ${loading
                                        ? "bg-indigo-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700"
                                    } text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out`}
                                type="submit"
                                disabled={loading || !username || !password} // Also disable if fields are empty
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin h-5 w-5" /> Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="text-sm text-center text-gray-600 space-y-2">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign Up
                            </Link>
                        </p>
                        <p>
                            <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Back to Home
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Signin;