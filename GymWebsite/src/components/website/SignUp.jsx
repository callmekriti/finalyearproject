import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
// Optional: Import icons for messages
import { FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa'; // Added FaSpinner

// --- Helper Component: InputField ---
// Moved outside the Signup component to prevent re-definition on every render
const InputField = ({ id, label, type, placeholder, value, onChange, required = true, hasError = false }) => (
    <div className="mb-5">
        <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor={id}
        >
            {label}{required ? '*' : ''}: {/* Indicate required fields */}
        </label>
        <input
            // Add error styling based on hasError prop
            className={`appearance-none block w-full bg-gray-50 text-gray-700 border ${
                hasError ? 'border-red-500' : 'border-gray-300'
            } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 ease-in-out`}
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
        />
         {/* Optional: You could add field-specific error messages here if 'error' state becomes an object */}
    </div>
);


// --- Main Component: Signup ---
const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [error, setError] = useState(''); // Can be a string (general error) or object (field errors)
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- Field-specific error state (Optional but recommended for better UX) ---
    // const [fieldErrors, setFieldErrors] = useState({});
    // Example: setFieldErrors({ username: 'Username already taken.' });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        // setFieldErrors({}); // Clear field errors if using them

        // Basic frontend validation (example)
        if (!username || !password || !firstName || !lastName || !email || !dateOfBirth) {
             setError("Please fill in all required fields.");
             // You could also set field-specific errors here
             // setFieldErrors({ general: "Please fill in all required fields." });
             setIsLoading(false);
             return;
        }

        try {
            // Log cautiously in production (avoid logging passwords)
            console.log('Submitting registration for:', username);

            const response = await axios.post('http://localhost:8000/register/', {
                username: username,
                password: password, // Send raw password; backend should hash it
                first_name: firstName,
                last_name: lastName,
                email: email,
                // Only send optional fields if they have a value, or handle nulls in backend
                phone_number: phoneNumber || null,
                address: address || null,
                date_of_birth: dateOfBirth,
            });

            setSuccessMessage('Registration successful! Welcome aboard.');
            setError('');
            // Clear form fields
            setUsername('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhoneNumber('');
            setAddress('');
            setDateOfBirth('');

            console.log('Registration successful:', response.data);
            // Optionally redirect to login or dashboard after a delay
            // setTimeout(() => navigate('/login'), 2000);

        } catch (err) {
            console.error('Registration failed:', err.response || err);
            let errorMessage = 'An error occurred during registration. Please try again.';
            // Reset success message on error
             setSuccessMessage('');

            if (err.response && err.response.data) {
                const responseData = err.response.data;
                 // Check for Django Rest Framework field errors (object)
                if (typeof responseData === 'object' && responseData !== null) {
                    // Extract the *first* field error found for simplicity
                    const fields = Object.keys(responseData);
                    if (fields.length > 0) {
                        const fieldName = fields[0];
                        const fieldErrors = responseData[fieldName];
                        // Capitalize field name and get the first error message
                        const displayFieldName = fieldName.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
                        errorMessage = `${displayFieldName}: ${Array.isArray(fieldErrors) && fieldErrors.length > 0 ? fieldErrors[0] : 'Invalid input.'}`;
                         // Optional: Store all field errors for per-field display
                         // setFieldErrors(responseData);
                         // Set a general error message as well
                         setError("Please correct the errors below.");
                    } else {
                        // If it's an object but no specific fields (like non_field_errors)
                         errorMessage = JSON.stringify(responseData);
                    }
                } else if (typeof responseData === 'string') {
                    // If the backend sends a plain string error
                    errorMessage = responseData;
                }
            } else if (err.message === "Network Error") {
                 errorMessage = "Cannot connect to the server. Please check your network connection.";
            } else if (err.message) {
                 errorMessage = err.message; // Fallback for other errors
            }

             // Set the general error message state if not setting field-specific errors
             // If using fieldErrors, you might only set the general 'error' for non-field issues
             // or keep it as a general indicator like "Please correct errors".
            // if (!Object.keys(fieldErrors).length) { // Only set general if no field errors were parsed
                setError(errorMessage);
            // }

        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-12">
            <div className="bg-white shadow-xl rounded-xl px-8 sm:px-10 pt-8 pb-10 mb-4 w-full max-w-lg">
                <h2 className="text-gray-800 text-3xl font-bold mb-8 text-center">
                    Create Your Account
                </h2>

                {successMessage && (
                    <div className="flex items-center bg-green-100 text-green-700 border border-green-300 rounded-md p-4 mb-6 text-sm" role="alert">
                        <FaCheckCircle className="mr-3 text-green-500 flex-shrink-0" size={20} />
                        <span>{successMessage}</span>
                    </div>
                )}
                {/* Display general error message */}
                {error && typeof error === 'string' && ( // Ensure 'error' is a string before rendering
                    <div className="flex items-start bg-red-100 text-red-700 border border-red-300 rounded-md p-4 mb-6 text-sm" role="alert">
                        <FaExclamationTriangle className="mr-3 text-red-500 mt-0.5 flex-shrink-0" size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Pass hasError prop based on fieldErrors if implemented */}
                    {/* Example: hasError={!!fieldErrors.username} */}
                    <InputField
                        id="username"
                        label="Username"
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required={true}
                        // Example of passing field-specific error status
                        // hasError={!!fieldErrors.username}
                        // For simplicity, just using general error for now:
                        hasError={!!error && !username} // Basic indication if general error exists and field is empty
                    />
                    <InputField
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={true}
                        hasError={!!error && !password}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4">
                        <InputField
                            id="firstName"
                            label="First Name"
                            type="text"
                            placeholder="Your first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required={true}
                            hasError={!!error && !firstName}
                        />
                        <InputField
                            id="lastName"
                            label="Last Name"
                            type="text"
                            placeholder="Your last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required={true}
                            hasError={!!error && !lastName}
                        />
                    </div>

                    <InputField
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={true}
                        hasError={!!error && !email}
                    />
                    <InputField
                        id="phoneNumber"
                        label="Phone Number"
                        type="tel"
                        placeholder="e.g., 00000000000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required={false} // Mark as optional
                        hasError={false} // Optional fields less likely to have validation error initially
                    />
                    <InputField
                        id="address"
                        label="Address"
                        type="text"
                        placeholder="Street, City"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required={false} // Mark as optional
                        hasError={false}
                    />
                    <InputField
                        id="dateOfBirth"
                        label="Date of Birth"
                        type="date"
                        placeholder="YYYY-MM-DD"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required={true}
                        hasError={!!error && !dateOfBirth}
                    />

                    <div className="mt-8">
                        <button
                            className={`w-full flex items-center justify-center gap-2 ${isLoading
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                } text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin h-5 w-5" /> Registering...
                                </>
                             ) : (
                                'Register'
                             )}
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        {/* Use Link for client-side routing */}
                        <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;