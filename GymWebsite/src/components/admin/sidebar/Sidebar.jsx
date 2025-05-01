import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dumbbell from "./Dumbbell.png";
import Logo from "./Logo.png";
import { RiDashboardFill } from "react-icons/ri";
import { MdPeopleAlt, MdAnalytics } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { GiStrong } from "react-icons/gi";
import { FaCalendarDays } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { SiGoogleclassroom } from "react-icons/si";
function Sidebar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/");
    console.log("User logged out");
  };

  return (
    <div className="h-screen bg-white shadow-md border-r w-60 font-['Roboto']">
      <div className="flex flex-col justify-between h-full py-6 px-4">
        {/* Logo */}
        <div className="flex flex-col gap-10">
          <div className="flex justify-center">
            <img src={Logo} alt="Logo" className="w-32 md:w-40 object-contain" />
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-4">
            {[
              { to: "/admin/dashboard", icon: <RiDashboardFill />, label: "Dashboard" },
              { to: "/admin/members", icon: <MdPeopleAlt />, label: "Members" },
              { to: "/admin/transactions", icon: <GrTransaction />, label: "Transactions" },
              { to: "/admin/trainers", icon: <GiStrong />, label: "Trainers" },
              { to: "/admin/events", icon: <FaCalendarDays />, label: "Events" },
              { to: "/admin/attendance", icon: <MdAnalytics />, label: "Attendance" },
              { to: "/admin/analytics", icon: <MdAnalytics />, label: "Analytics" },
              { to: "/admin/classes", icon: <SiGoogleclassroom />, label: "Classes" },
            ].map((item, index) => (
              <Link
                to={item.to}
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-orange-50 text-slate-700 hover:text-orange-500 transition-all"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-base font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 cursor-pointer text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <IoLogOut className="text-xl" />
          <span className="text-base font-medium">Logout</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
