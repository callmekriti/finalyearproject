import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Train } from "lucide-react";
import Signup from "./components/website/SignUp.jsx";
import Dashboard from "./components/website/Dashboard.jsx"
import TrainerDashboard from "./components/website/TrainerDashboard.jsx";
import AttendanceForm from "./components/website/AttendanceForm.jsx";
// Lazy loading components
const Sidebar = lazy(() => import("./components/admin/sidebar/Sidebar"));
const Member = lazy(() => import("./components/admin/member/Member"));
const Events = lazy(() => import("./components/admin/calendar/Events"));
const Transaction = lazy(() =>import("./components/admin/transaction/Transaction"));
const LandingPage = lazy(() => import("./components/website/LandingPage"));
const Trainer = lazy(() => import("./components/admin/Trainer/Trainer.jsx"));
const Main = lazy(() => import("./components/admin/main/Main.jsx"));
const Signin = lazy(() => import("./components/website/Signin"));
const GymEvent = lazy(() => import("./components/website/GymEvent"));
const UserInfoCard = lazy(() => import("./components/website/UserInfoCard"));
const Unauthorized = lazy(() => import("./components/website/Unauthorized"));
const Report = lazy(() => import("./components/admin/report/Report"));

/**
 * AdminLayout Component
 * Wraps the admin section with a sidebar and an outlet for nested routes.
 */
const AdminLayout = () => (
  <div className="flex h-screen bg-white dark:bg-zinc-100">
    <section className="w-[10%] sm:w-[15%]">
      <Sidebar />
    </section>
    <section className="flex flex-col w-[90%] sm:w-[85%] overflow-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </section>
  </div>
);

/**
 * ProtectedRoute Component
 * Protects routes by checking if the user is logged in and has the required role.
 */
const ProtectedRoute = ({ isLoggedIn, userRole, allowedRoles, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

/**
 * App Component
 * Main application component with routing and authentication logic.
 */
function App() {
  const [isLoading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [savedEvents, setSavedEvents] = useState([]);

  // Fetch user data and saved events from localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const events = localStorage.getItem("savedEvents");

    if (token && role) {
      setUserRole(role);
      console.log(role)
      setIsLoggedIn(true);
    }

    if (events) {
      setSavedEvents(JSON.parse(events));
    }

    setLoading(false);
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      <Router>
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/gymevent" element={<GymEvent />} />
            <Route path="/settings" element={<UserInfoCard />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/trainerdashboard" element={<TrainerDashboard/>}/>
            <Route path="/attendance" element={<AttendanceForm/>}/>
            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  userRole={userRole}
                  allowedRoles={["admin", "trainer"]}
                >
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Main />} />
              <Route path="members" element={<Member />} />
              <Route path="trainers" element={<Trainer />} />
              <Route path="transactions" element={<Transaction />} />
              <Route path="events" element={<Events savedEvents={savedEvents} />} />
              <Route path="analytics" element={<Report />} />
            </Route>

            {/* Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>

      {/* Toast notifications */}
      <ToastContainer />
    </>
  );
}

export default App;