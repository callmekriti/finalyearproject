import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DandM from "../../assets/DandM.png";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa"; // <- Spinner icon

const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(username);
      console.log(password);
      const response = await axios.post("http://localhost:8000/login/", {
        username,
        password,
      });

      const { token, user_id, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user_id);
      localStorage.setItem("role", role);

      if (role === "admin" ) {
        navigate("/admin/dashboard", { replace: true });
      } else if (role==="trainer"){
        navigate("/trainerdashboard");
      }else {
        navigate("/dashboard");
      };

      window.location.reload();
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-2xl shadow-2xl rounded-2xl overflow-hidden bg-white">
        <div className="w-1/2 hidden md:block">
          <img src={DandM} alt="Sign In" className="object-cover w-full h-full" />
        </div>
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
          <form className="space-y-4" onSubmit={handleSignIn}>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="username">
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                className={`flex items-center justify-center gap-2 ${
                  loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-700"
                } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

            </div>
          </form>
          <div className="mt-2 text-start">
            <Link to="/" className="text-sm text-blue-500 hover:text-blue-700 font-semibold">
              Back to home
            </Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
