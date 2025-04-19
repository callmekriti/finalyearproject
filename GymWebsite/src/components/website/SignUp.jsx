import React, { useState } from 'react';
import axios from 'axios';
// Optional: Import icons for messages
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState(''); // Keep error structure as is (can be object or string)
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state for feedback

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading
    setError('');       // Clear previous errors
    setSuccessMessage(''); // Clear previous success

    try {
        console.log(username, password);
      const response = await axios.post('http://localhost:8000/register/', {
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phoneNumber,
        address: address,
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
    } catch (error) {
      // Try to extract a user-friendly message
      let errorMessage = 'An error occurred during registration. Please try again.';
      if (error.response && error.response.data) {
          // If the response data is an object, stringify it or extract specific fields
          if (typeof error.response.data === 'object') {
              // Example: Extract common Django Rest Framework errors
              const fields = Object.keys(error.response.data);
              if (fields.length > 0) {
                  const field = fields[0];
                  errorMessage = `${field}: ${error.response.data[field][0] || 'Invalid input.'}`; // Take first error of first field
              } else {
                 errorMessage = JSON.stringify(error.response.data); // Fallback to stringify
              }
          } else {
              errorMessage = error.response.data; // If it's already a string
          }
      } else if (error.message) {
          errorMessage = error.message;
      }
      setError(errorMessage); // Set the extracted or default message
      setSuccessMessage('');
      console.error('Registration failed:', error);
    } finally {
        setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  // Reusable input field component (optional, but good practice)
  const InputField = ({ id, label, type, placeholder, value, onChange, required = true }) => (
      <div className="mb-5"> {/* Increased spacing */}
        <label
          className="block text-gray-700 text-sm font-semibold mb-2" // Slightly bolder label
          htmlFor={id}
        >
          {label}:
        </label>
        <input
          className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 ease-in-out" // Enhanced styling
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
  );


  return (
    // Use a subtle gradient or a slightly darker background
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-12">
      {/* Increased max-width, padding, and added rounded-xl and shadow-xl */}
      <div className="bg-white shadow-xl rounded-xl px-8 sm:px-10 pt-8 pb-10 mb-4 w-full max-w-lg">
        <h2 className="text-gray-800 text-3xl font-bold mb-8 text-center">
          Create Your Account {/* Changed wording slightly */}
        </h2>

        {/* Improved Message Styling */}
        {successMessage && (
          <div className="flex items-center bg-green-100 text-green-700 border border-green-300 rounded-md p-4 mb-6 text-sm">
             <FaCheckCircle className="mr-3 text-green-500" size={20} />
            {successMessage}
          </div>
        )}
        {error && (
          <div className="flex items-start bg-red-100 text-red-700 border border-red-300 rounded-md p-4 mb-6 text-sm">
             <FaExclamationTriangle className="mr-3 text-red-500 mt-0.5 flex-shrink-0" size={20} />
            {/* Display the processed error message string */}
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
           {/* Use the reusable InputField component */}
          <InputField
              id="username"
              label="Username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />

          {/* Optional: Grid for First/Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4">
             <InputField
                  id="firstName"
                  label="First Name"
                  type="text"
                  placeholder="Your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
              />
              <InputField
                  id="lastName"
                  label="Last Name"
                  type="text"
                  placeholder="Your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
              />
          </div>

          <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />
           <InputField
              id="phoneNumber"
              label="Phone Number"
              type="tel" // Use type="tel" for phone numbers
              placeholder="(Optional) e.g., 00000000000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              // required={false} // Example: Make phone optional if needed
          />
           <InputField
              id="address"
              label="Address"
              type="text"
              placeholder="(Optional) Street, City"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              // required={false} // Example: Make address optional if needed
          />
           <InputField
              id="dateOfBirth"
              label="Date of Birth"
              type="date"
              placeholder="YYYY-MM-DD"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
          />

          {/* Improved Button Styling */}
          <div className="mt-8"> {/* Add margin top for separation */}
            <button
              className={`w-full ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out`}
              type="submit"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>

          {/* Optional: Link to Login */}
          <p className="text-center text-sm text-gray-500 mt-6">
             Already have an account?{' '}
             <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
               Log in
             </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;