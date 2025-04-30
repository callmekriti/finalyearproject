import React, { useEffect, useState } from "react";
import KhaltiCheckout from "khalti-checkout-web";
import { useLocation, useNavigate, Link } from "react-router-dom"; // Import Link
import axios from "axios";
import { FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import DandM from "../../assets/DandM.png";
// Reusable Input Field Component
const InputField = ({ id, label, type, placeholder, value, onChange, disabled, hasError }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
            {label}
        </label>
        <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${hasError ? 'border-red-500' : ''}`}
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
        />
        {hasError && (
            <p className="text-red-500 text-xs italic">Please fill out this field.</p>
        )}
    </div>
);
const PricingCard = ({ title, price, features, bgClass, priceNote }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [membership, setMembership] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State for displaying general form errors
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/login/", {
        username,
        password,
      });

      const { token, user_id, role } = response.data;

      if (!token || !user_id || !role) {
        throw new Error("Incomplete login data received from server.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user_id);
      localStorage.setItem("role", role);

      console.log("Login successful. Role:", role);

      setShowLogin(false); // Close the login popup
      // Proceed with Khalti payment if a plan was selected
      
      if (selectedPlan) {
          handleKhaltiPayment(selectedPlan.price, selectedPlan.title);
      }

    } catch (err) {
      console.error("Login error:", err.response || err.message || err);
      let errorMessage = "Invalid credentials or server error. Please try again.";
      if (err.response && err.response.data) {
        if (typeof err.response.data.detail === "string") {
          errorMessage = err.response.data.detail;
        } else if (
          typeof err.response.data.non_field_errors === "object" &&
          Array.isArray(err.response.data.non_field_errors) &&
          err.response.data.non_field_errors.length > 0
        ) {
          errorMessage = err.response.data.non_field_errors[0];
        } else if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        }
      } else if (err.message === "Network Error") {
        errorMessage = "Cannot connect to the server. Please check your network.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateTransactionId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleKhaltiPayment = (amount, title) => {
    const totalAmount = amount * 100;

    let checkout = new KhaltiCheckout({
      publicKey: "test_public_key_617c4c6fe77c441d88451ec1408a0c0e",
      productIdentity: "1234567890",
      productName: title,
      productUrl: "http://localhost:3000",
      eventHandler: {
        onSuccess(payload) {
          console.log("Payment Successful:", payload);

          let data = {
            token: payload.token,
            amount: totalAmount,
          };

          let config = {
            headers: {
              Authorization:
                "test_secret_key_3f78fb6364ef4bd1b5fc670ce33a06f5",
            },
          };

          axios
            .post("/khalti-api/payment/verify/", data, config)
            .then((response) => {
              console.log("Verification Response:", response.data);
              const newTransactionId = generateTransactionId();
              setTransactionId(newTransactionId);
              setMembership(title);
              setShowPopup(true);
            })
            .catch((error) => {
              console.error("Payment Verification Error:", error);
            });
        },
        onError(error) {
          console.error("Khalti Payment Error:", error);
        },
        onClose() {
          console.log("Khalti Checkout Closed");
        },
      },
      paymentPreference: [
        "KHALTI",
        "EBANKING",
        "MOBILE_BANKING",
        "CONNECT_IPS",
        "SCT",
      ],
    });

    checkout.show({ amount: totalAmount });
    navigate("/dashboard");
  };

    const handleBuyNowClick = (plan) => {
        if (!localStorage.getItem("userId")) {
          console.log(plan);
            setSelectedPlan(plan); // Store the selected plan
            setShowLogin(true); // Show the login popup
        } else {
            // If already logged in, proceed with payment
            handleKhaltiPayment(plan.price, plan.title);
        }
    };

  return (
    <div className="w-[300px] m-6 bg-white text-black rounded-xl shadow-2xl mb-4">
      <div className="bg-purple-100 p-4 rounded-xl">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">
          Best for {title.toLowerCase()} projects
        </p>
        <div className="mt-6">
          <span className="text-4xl font-bold">RS.{price}</span>
          <span className="text-lg font-medium">/Month</span>
        </div>
        <p className="text-sm text-gray-500 mt-1 mb-6">{priceNote}</p>
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-purple-500 text-white"
            onClick={() => handleBuyNowClick({ price, title })}
        >
          Buy Now
        </button>
      </div>
      <div className="bg-white p-4 rounded-2xl">
        <ul className="list-none space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="material-icons text-green-400">
                check_circle
              </span>
              <span className="ml-2">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {showLogin && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="flex w-full max-w-4xl shadow-xl rounded-xl overflow-hidden bg-white">
            {/* Image Section */}
            <div className="w-1/2 hidden md:block flex-shrink-0">
              <img
                src={DandM}
                alt="Gym illustration"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Form Section */}
            <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                Welcome Back!
              </h2>

              {/* Error Message Display */}
              {error && (
                <div
                  className="flex items-start bg-red-100 text-red-700 border border-red-300 rounded-md p-4 mb-6 text-sm"
                  role="alert"
                >
                  <FaExclamationTriangle
                    className="mr-3 text-red-500 mt-0.5 flex-shrink-0"
                    size={20}
                  />
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
                    className={`w-full flex items-center justify-center gap-2 ${
                      loading
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out`}
                    type="submit"
                    disabled={loading || !username || !password} // Also disable if fields are empty
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin h-5 w-5" />{" "}
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>
              </form>

              <div className="text-sm text-center text-gray-600 space-y-2">
                <p>
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign Up
                  </Link>
                </p>
                <p>
                  <button
                    onClick={() => setShowLogin(false)}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Close
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold">Payment Successful</h2>
            <p className="mt-2">
              Your transaction ID is:{" "}
              <span className="font-bold">{transactionId}</span>
            </p>
            <p className="mt-2">
              Your Membership Type is:{" "}
              <span className="font-bold">{membership}</span>
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Pricing = () => {
  const plans = [
    {
      title: "Basic Membership",
      price: 100,
      priceNote: "Rs.100/month",
      bgClass: "bg-blue-500",
      features: [
        "Access to basic gym equipment",
        "Personal locker",
        "Basic fitness classes",
        "General gym support",
        "Limited hours access",
      ],
    },
    {
      title: "Standard Membership",
      price: 150,
      priceNote: "Rs.150/month",
      bgClass: "bg-green-500",
      features: [
        "Access to full gym equipment",
        "Personal locker",
        "Advanced fitness classes",
        "Personal trainer sessions (limited)",
        "Extended hours access",
      ],
    },
    {
      title: "Premium Membership",
      price: 200,
      priceNote: "Rs.200/month",
      bgClass: "bg-red-500",
      features: [
        "Access to full gym equipment",
        "Priority locker",
        "Unlimited fitness classes",
        "Personal trainer sessions (unlimited)",
        "24/7 gym access",
      ],
    },
  ];

  return (
    <div className="p-8 flex justify-center items-center">
      <div className="flex flex-col lg:flex-row lg:gap-x-16">
        {plans.map((plan, index) => (
          <div key={index} className="w-full md:w-1/3 px-2 mb-4">
            <PricingCard {...plan} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;